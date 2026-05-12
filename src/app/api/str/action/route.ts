import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  buildDocumentRequestTemplate,
  buildFreezeAccountTemplate,
} from "@/lib/email/templates";

import type { FraudAccount } from "@/types/aml";
import { prisma } from "@/lib/prisma";

type ActionType = "freeze" | "documents";

type ActionPayload = {
  actionType?: ActionType;
  account?: FraudAccount;
};

const hasString = (
  value: unknown
): value is string =>
  typeof value === "string" &&
  value.trim().length > 0;

const isValidAccount = (
  value: unknown
): value is FraudAccount => {
  if (!value || typeof value !== "object")
    return false;

  const account = value as Record<
    string,
    unknown
  >;

  return (
    hasString(account.transactionId) &&
    typeof account.amount === "number"
  );
};

export async function POST(
  request: Request
) {
  try {
    const payload =
      (await request.json()) as ActionPayload;

    const actionType =
      payload.actionType ?? "freeze";

    if (!isValidAccount(payload.account)) {
      return NextResponse.json(
        {
          error: "Invalid account payload.",
        },
        { status: 400 }
      );
    }

    const account = payload.account;

    // =========================
    // Find STR Report
    // =========================
    const report =
      await prisma.sTRReport.findUnique({
        where: {
          transactionId:
            account.transactionId,
        },

        select: {
          createdById: true,
        },
      });

    if (!report?.createdById) {
      return NextResponse.json(
        {
          error:
            "No STR report found for this transaction.",
        },
        { status: 404 }
      );
    }

    // =========================
    // Find STR Creator
    // =========================
    const user =
      await prisma.user.findUnique({
        where: {
          id: report.createdById,
        },

        select: {
          email: true,
          name: true,
        },
      });

    if (!user?.email) {
      return NextResponse.json(
        {
          error:
            "STR creator email not found.",
        },
        { status: 404 }
      );
    }

    // =========================
    // Build Email Template
    // =========================
    let template;

    if (actionType === "documents") {
      template =
        buildDocumentRequestTemplate(
          account
        );
    } else {
      template =
        buildFreezeAccountTemplate(
          account
        );
    }

    // =========================
    // Send Email
    // =========================
    const resend = new Resend(
      process.env.RESEND_API_KEY
    );

    const result =
      await resend.emails.send({
        from:
          process.env
            .REGULATOR_FROM_EMAIL ||
          "regulator@surajc.in",

        to: user.email,

        subject: template.subject,

        html: template.html,

        text: template.text,
      });

    if (result.error) {
      return NextResponse.json(
        {
          error:
            "Failed to send email.",
          details: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        actionType === "freeze"
          ? "Freeze notification sent successfully."
          : "Document request sent successfully.",

      email: user.email,
    });
  } catch (error) {
    console.error(
      "Action processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process action request.",
      },
      { status: 500 }
    );
  }
}