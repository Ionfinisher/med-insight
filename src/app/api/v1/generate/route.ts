import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { question } = await request.json();

  try {
    const answer = await prisma.$queryRaw`
    SELECT * FROM get_related_papers(${question});
  `;

    return NextResponse.json(answer);
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Error fetching papers" },
      { status: 500 }
    );
  }
}
