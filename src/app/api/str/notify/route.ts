import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildFraudBankAlertTemplate,
  buildFraudComplianceTemplate,
  buildSuspiciousBankInquiryTemplate,
  buildSuspiciousComplianceTemplate,
} from "@/lib/email/templates";
import type { FraudAccount, NotificationCase, StrReport, SuspiciousTransaction } from "@/types/aml";

type NotifyPayload =
  | {
      caseType?: NotificationCase;
      account?: FraudAccount;
      report?: StrReport;
      transaction?: never;
    }
  | {
      caseType?: NotificationCase;
      transaction?: SuspiciousTransaction;
      account?: never;
      report?: never;
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

const isValidReport = (value: unknown): value is StrReport => {
  if (!value || typeof value !== "object") return false;

  const report = value as Record<string, unknown>;
  return (
    hasString(report.executiveSummary) &&
    hasString(report.transactionDetails) &&
    hasString(report.riskIndicators) &&
    hasString(report.recommendation)
  );
};

const isValidAccount = (value: unknown): value is FraudAccount => {
  if (!value || typeof value !== "object") return false;

  const account = value as Record<string, unknown>;
  return (
    hasString(account.accountId) &&
    hasString(account.holderName) &&
    hasString(account.transactionId) &&
    typeof account.amount === "number" &&
    hasString(account.country)
  );
};

const isValidSuspiciousTransaction = (value: unknown): value is SuspiciousTransaction => {
  if (!value || typeof value !== "object") return false;

  const transaction = value as Record<string, unknown>;
  return (
    hasString(transaction.transactionId) &&
    hasString(transaction.sender) &&
    hasString(transaction.receiver) &&
    typeof transaction.amount === "number" &&
    hasString(transaction.tradeType) &&
    hasString(transaction.suspicionReason) &&
    hasString(transaction.originatingBank)
  );
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NotifyPayload;
    const caseType = payload.caseType ?? "fraud";

    const resendApiKey = normalizeEnv(process.env.RESEND_API_KEY);
    const fromEmail = normalizeEnv(process.env.RESEND_FROM_EMAIL);
    const complianceEmail = normalizeEnv(process.env.COMPLIANCE_TEAM_EMAIL);
    const defaultBankEmail =
      normalizeEnv(process.env.DEFAULT_ORIGINATING_BANK_EMAIL) ?? normalizeEnv(process.env.DEFAULT_CUSTOMER_EMAIL);

    if (!resendApiKey || !fromEmail || !complianceEmail) {
      return NextResponse.json(
        {
          error: "Missing email configuration. Required: RESEND_API_KEY, RESEND_FROM_EMAIL and COMPLIANCE_TEAM_EMAIL.",
        },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

    if (caseType === "suspicious") {
      if (!isValidSuspiciousTransaction(payload.transaction)) {
        return NextResponse.json({ error: "Invalid suspicious transaction payload." }, { status: 400 });
      }

      const transactionBankEmail = normalizeEnv(payload.transaction.originatingBankEmail);
      const bankEmail =
        transactionBankEmail && !isPlaceholderEmail(transactionBankEmail) ? transactionBankEmail : defaultBankEmail;
      if (!bankEmail) {
        return NextResponse.json(
          {
            error:
              "Missing valid originating bank email. Provide a real originatingBankEmail or set DEFAULT_ORIGINATING_BANK_EMAIL in .env.",
          },
          { status: 500 },
        );
      }

      const complianceTemplate = buildSuspiciousComplianceTemplate(payload.transaction);
      const bankTemplate = buildSuspiciousBankInquiryTemplate(payload.transaction);

      const [complianceResult, bankResult] = await Promise.all([
        resend.emails.send({
          from: fromEmail,
          to: complianceEmail,
          subject: complianceTemplate.subject,
          html: complianceTemplate.html,
          text: complianceTemplate.text,
        }),
        resend.emails.send({
          from: fromEmail,
          to: bankEmail,
          subject: bankTemplate.subject,
          html: bankTemplate.html,
          text: bankTemplate.text,
        }),
      ]);

      if (complianceResult.error || bankResult.error) {
        return NextResponse.json(
          {
            error: "Suspicious-case notification failed.",
            complianceError: toProviderErrorText(complianceResult.error),
            bankError: toProviderErrorText(bankResult.error),
            note: "Check RESEND_FROM_EMAIL domain verification and recipient email validity.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json({
        message: "Suspicious-case inquiry sent to compliance and originating bank.",
        complianceEmailId: complianceResult.data?.id,
        bankEmailId: bankResult.data?.id,
      });
    }

    if (!isValidAccount(payload.account)) {
      return NextResponse.json({ error: "Invalid fraud account payload." }, { status: 400 });
    }

    if (!isValidReport(payload.report)) {
      return NextResponse.json({ error: "Generate STR report before sending fraud alert." }, { status: 400 });
    }

    const accountBankEmail = normalizeEnv(payload.account.originatingBankEmail);
    const bankEmail = accountBankEmail && !isPlaceholderEmail(accountBankEmail) ? accountBankEmail : defaultBankEmail;
    if (!bankEmail) {
      return NextResponse.json(
        {
          error:
            "Missing valid originating bank email. Provide a real originatingBankEmail or set DEFAULT_ORIGINATING_BANK_EMAIL in .env.",
        },
        { status: 500 },
      );
    }

    const complianceTemplate = buildFraudComplianceTemplate(payload.account, payload.report);
    const bankTemplate = buildFraudBankAlertTemplate(payload.account, payload.report);

    const [complianceResult, bankResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: complianceEmail,
        subject: complianceTemplate.subject,
        html: complianceTemplate.html,
        text: complianceTemplate.text,
      }),
      resend.emails.send({
        from: fromEmail,
        to: bankEmail,
        subject: bankTemplate.subject,
        html: bankTemplate.html,
        text: bankTemplate.text,
      }),
    ]);

    if (complianceResult.error || bankResult.error) {
      return NextResponse.json(
        {
          error: "Fraud alert notification failed.",
          complianceError: toProviderErrorText(complianceResult.error),
          bankError: toProviderErrorText(bankResult.error),
          note: "Check RESEND_FROM_EMAIL domain verification and recipient email validity.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "Fraud alert sent to compliance and originating bank.",
      complianceEmailId: complianceResult.data?.id,
      bankEmailId: bankResult.data?.id,
    });
  } catch {
    return NextResponse.json({ error: "Unable to send notifications." }, { status: 500 });
  }
}
