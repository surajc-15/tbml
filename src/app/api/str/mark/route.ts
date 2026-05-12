import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Payload = {
  transactionId?: string;
  verdict?: string;
};

const validVerdicts = new Set(["CLEAN", "FRAUD"]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const tx = payload.transactionId?.trim();
    const verdictRaw = payload.verdict?.trim().toUpperCase();

    if (!tx || !verdictRaw) {
      return NextResponse.json({ error: "Missing transactionId or verdict." }, { status: 400 });
    }

    if (!validVerdicts.has(verdictRaw)) {
      return NextResponse.json({ error: "Invalid verdict. Allowed: CLEAN, FRAUD." }, { status: 400 });
    }

    const existing = await prisma.aml_audit_log.findUnique({ where: { transactionId: tx } });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    const now = new Date();
    const updated = await prisma.aml_audit_log.update({
      where: { transactionId: tx },
      data: { verdict: verdictRaw, loggedAt: now },
    });

    return NextResponse.json({
      message: `Verdict set to ${verdictRaw}.`,
      updated: { transactionId: updated.transactionId, verdict: updated.verdict, loggedAt: updated.loggedAt?.toISOString() },
    });
  } catch (err) {
    return NextResponse.json({ error: "Unable to update verdict." }, { status: 500 });
  }
}
