import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildDocumentRequestTemplate, buildFreezeAccountTemplate, buildFraudComplianceTemplate } from "@/lib/email/templates";
import type { FraudAccount } from "@/types/aml";
import { prisma } from "@/lib/prisma";

type ActionType = "freeze" | "documents";

type ActionPayload = {
  actionType?: ActionType;
  account?: FraudAccount;
};

const hasString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const normalizeEnv = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const isPlaceholderEmail = (email: string): boolean => email.toLowerCase().endsWith(".example");

const toProviderErrorText = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const err = value as Record<string, unknown>;
    const name = typeof err.name === "string" ? err.name : "ProviderError";
    const message = typeof err.message === "string" ? err.message : undefined;
    return message ? `${name}: ${message}` : name;
  }
  return undefined;
};

const isValidAccount = (value: unknown): value is FraudAccount => {
  if (!value || typeof value !== "object") return false;
  const account = value as Record<string, unknown>;
  return (
    hasString(account.accountId) &&
    hasString(account.holderName) &&
    hasString(account.transactionId) &&
    typeof account.amount === "number"
  );
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ActionPayload;
    const actionType = payload.actionType ?? "freeze";

    if (!isValidAccount(payload.account)) {
      return NextResponse.json({ error: "Invalid account payload." }, { status: 400 });
    }

    const resendApiKey = normalizeEnv(process.env.RESEND_API_KEY);
    const fromEmail = normalizeEnv(process.env.RESEND_FROM_EMAIL);
    const defaultSenderBankEmail = normalizeEnv(process.env.DEFAULT_ORIGINATING_BANK_EMAIL);
    const defaultReceiverBankEmail =
      normalizeEnv(process.env.DEFAULT_RECEIVER_BANK_EMAIL) ?? normalizeEnv(process.env.DEFAULT_ORIGINATING_BANK_EMAIL);

    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        {
          error: "Missing email configuration. Required: RESEND_API_KEY and RESEND_FROM_EMAIL.",
        },
        { status: 500 },
      );
    }

    const senderBankEmail =
      payload.account.originatingBankEmail && !isPlaceholderEmail(payload.account.originatingBankEmail)
        ? payload.account.originatingBankEmail
        : defaultSenderBankEmail;
    const receiverBankEmail = defaultReceiverBankEmail;

    if (!senderBankEmail || !receiverBankEmail) {
      return NextResponse.json(
        {
          error:
            "Missing sender/receiver bank emails. Set DEFAULT_ORIGINATING_BANK_EMAIL and DEFAULT_RECEIVER_BANK_EMAIL.",
        },
        { status: 500 },
      );
    }

    const senderBankName = payload.account.originatingBank || "Sender Bank";
    const receiverBankName = "Receiver Bank";
    const senderTemplate =
      actionType === "documents"
        ? buildDocumentRequestTemplate(payload.account, senderBankName, "Sender")
        : buildFreezeAccountTemplate(payload.account, senderBankName, "Sender");
    const receiverTemplate =
      actionType === "documents"
        ? buildDocumentRequestTemplate(payload.account, receiverBankName, "Receiver")
        : buildFreezeAccountTemplate(payload.account, receiverBankName, "Receiver");

    const resend = new Resend(resendApiKey);
    const [senderResult, receiverResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: senderBankEmail,
        subject: senderTemplate.subject,
        html: senderTemplate.html,
        text: senderTemplate.text,
      }),
      resend.emails.send({
        from: fromEmail,
        to: receiverBankEmail,
        subject: receiverTemplate.subject,
        html: receiverTemplate.html,
        text: receiverTemplate.text,
      }),
    ]);

    if (senderResult.error || receiverResult.error) {
      return NextResponse.json(
        {
          error: "Action email dispatch failed.",
          senderError: toProviderErrorText(senderResult.error),
          receiverError: toProviderErrorText(receiverResult.error),
          note: "Check email recipients and RESEND_FROM_EMAIL domain verification.",
        },
        { status: 502 },
      );
    }
    // Also notify the STR report creator (if any) about this admin action
    let creatorNotify: { success: boolean; email?: string; note?: string } | null = null;
    try {
      const report = await prisma.sTRReport.findUnique({
        where: { transactionId: payload.account!.transactionId },
        select: { createdById: true, reportMarkdown: true },
      });

      if (report?.createdById) {
        const user = await prisma.user.findUnique({ where: { id: report.createdById }, select: { email: true } });
        if (user?.email) {
          // Use existing compliance template to notify the STR creator
          const pseudoReport = {
            executiveSummary: report.reportMarkdown ?? "STR details available in dashboard.",
            transactionDetails: "",
            riskIndicators: "",
            recommendation: "",
          } as any;

          const creatorTemplate = buildFraudComplianceTemplate(payload.account!, pseudoReport as any);

          const creatorResult = await resend.emails.send({
            from: fromEmail,
            to: user.email,
            subject: creatorTemplate.subject,
            html: creatorTemplate.html,
            text: creatorTemplate.text,
          });

          if (creatorResult.error) {
            creatorNotify = { success: false, email: user.email, note: toProviderErrorText(creatorResult.error) };
          } else {
            creatorNotify = { success: true, email: user.email };
          }
        } else {
          creatorNotify = { success: false, note: "Creator user has no email." };
        }
      }
    } catch (err) {
      creatorNotify = { success: false, note: "Failed to notify creator." };
    }

    return NextResponse.json({
      message:
        actionType === "documents"
          ? "Document request sent to sender and receiver banks."
          : "Freeze request sent to sender and receiver banks.",
      senderEmailId: senderResult.data?.id,
      receiverEmailId: receiverResult.data?.id,
      creatorNotify,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process action request." }, { status: 500 });
  }
}
