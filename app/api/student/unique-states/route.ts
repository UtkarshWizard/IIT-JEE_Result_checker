import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
  const states = await prisma.student.findMany({
    distinct: ['state'],
    select: { state: true },
  });
  const sortedStates = states.map(s => s.state).sort();
  return NextResponse.json(sortedStates);
}
