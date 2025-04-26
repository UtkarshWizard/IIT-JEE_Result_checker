import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { state, gender, failedSubject, resultStatus } = await req.json();

    const students = await prisma.student.findMany({
      where: {
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
      },
    });

    const count = students.length;
    const parts: string[] = [];

    if (gender) parts.push(gender.toLowerCase());
    parts.push('candidates');

    if (failedSubject) parts.push(`who failed in ${failedSubject}`);
    if (resultStatus === 'Failed') parts.push('who did not qualify');
    if (resultStatus === 'Passed') parts.push('who qualified');
    if (state) parts.push(`from ${state}`);

    const summary = `${count} ${parts.join(' ')} in IIT JEE 2025`;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating filter summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
