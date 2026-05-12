import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      transactionId,
      reportMarkdown,
      actionTaken,
      createdById,
    } = body;

    const report = await prisma.sTRReport.create({
      data: {
        transactionId,
        reportMarkdown,
        actionTaken,
        createdById,
      },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to save STR report",
      },
      {
        status: 500,
      }
    );
  }
}