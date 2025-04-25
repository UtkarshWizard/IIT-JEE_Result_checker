import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { hallTicket } = await req.json();

    if (!hallTicket) {
        return NextResponse.json({ error: 'Hall ticket is required' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: {hallTicket} });

    if (!student) {
        return NextResponse.json({ error: 'Student not found, check entered hallticket'} , { status: 400 })
    }

    return NextResponse.json({ student })
}