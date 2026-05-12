import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
const reports = await prisma.sTRReport
.findMany({
          orderBy: {
        createdAt: "desc",
      },

      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            bankName: true,
          },
        },
      },
    });

    return NextResponse.json({
      reports,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch reports",
      },
      {
        status: 500,
      }
    );
  }
}