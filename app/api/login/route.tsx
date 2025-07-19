import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/auth"; // Your JWT helpers

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user or create if not exist (example)
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    // Create a token for this user (adjust your token signing method)
    const token = signToken(user.id);

    // Check if user has passkey set
    const hasPasskey = Boolean(user.passkey);

    return NextResponse.json({ token, hasPasskey });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
