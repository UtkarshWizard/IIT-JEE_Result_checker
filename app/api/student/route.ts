import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Read query params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const state = searchParams.get('state') || undefined;
  const gender = searchParams.get('gender') || undefined;
  const failedSubject = searchParams.get('failedSubject') || undefined;
  const resultStatus = searchParams.get('resultStatus') || undefined;

  const skip = (page - 1) * limit;

  const where: any = {
    ...(state && { state }),
    ...(gender && { gender }),
    ...(resultStatus === "Passed" && { passed: true }),
    ...(resultStatus === "Failed" && { passed: false }),
    ...(failedSubject && {
      OR: [
        failedSubject === "Physics" ? { physicsMarks: { lt: 20 } } : {},
        failedSubject === "Chemistry" ? { chemistryMarks: { lt: 20 } } : {},
        failedSubject === "Math" ? { mathMarks: { lt: 20 } } : {},
      ],
    }),
  };

  const students = await prisma.student.findMany({
    where,
    orderBy: { rank: 'asc' },
    skip,
    take: limit,
  });

  return NextResponse.json(students);
}
