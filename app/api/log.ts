import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { action, ...details } = await req.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    // Save audit log or event to DB
    await prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        action,
        newValue: JSON.stringify(details),
        createdAt: new Date(),
        // optionally: userId, ipAddress, userAgent from headers if available
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
