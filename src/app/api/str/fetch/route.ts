import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const transactionId = typeof body.transactionId === "string" ? body.transactionId : undefined;
    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const report = await prisma.sTRReport.findUnique({
      where: { transactionId },
      select: {
        id: true,
        transactionId: true,
        createdAt: true,
        actionTaken: true,
        createdById: true,
        reportMarkdown: true,
        createdBy: {
          select: {
            email: true,
            name: true,
            username: true,
          },
        },
      },
    });
    if (!report) {
      return NextResponse.json({ error: "STR report not found" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch STR report" }, { status: 500 });
  }
}
