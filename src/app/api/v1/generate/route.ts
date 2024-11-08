import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { question } = await request.json();

  try {
    // const papers = await prisma.$queryRaw`
    //   SELECT * FROM get_papers_by_keyword(${question})
    // `;

    const papers = await prisma.$queryRaw`SELECT * FROM research_papers`;

    console.log("Research Papers:", papers);
    return NextResponse.json(papers, { status: 200 });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Error fetching papers" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
