import { NextResponse, NextRequest } from "next/server";
import { Client } from "pg";

const PGSQLURL = process.env.DATABASE_URL!;

if (!PGSQLURL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { question } = await request.json();

  try {
    const answer = await client.query(`
      SELECT generate_rag_answer('${question}');
  `);

    const generateRagAnswer = answer.rows[0].generate_rag_answer;
    return NextResponse.json(generateRagAnswer);
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Error fetching papers" },
      { status: 500 }
    );
  }
}
