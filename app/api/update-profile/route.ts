// app/api/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).optional(),
  phoneNumber: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
  // Add more fields as you want to allow users to update here
});

export async function POST(req: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token to get userId
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Parse and validate body data with Zod
    const body = await req.json();
    const parseResult = ProfileUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    // Fetch current user data
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Extract user-agent and IP address from headers
    const userAgent = req.headers.get("user-agent") || null;
    // X-Forwarded-For may contain multiple IPs, take first one or fallback to "unknown"
    const ipAddressRaw = req.headers.get("x-forwarded-for");
    const ipAddress = ipAddressRaw ? ipAddressRaw.split(",")[0].trim() : "unknown";

    // Prepare update data and audit logs for changed fields only
    const updates: Record<string, any> = {};
    const auditEntries = [];

    for (const key of Object.keys(parseResult.data)) {
      const newValue = parseResult.data[key as keyof typeof parseResult.data];
      const oldValue = user[key as keyof typeof user];

      if (newValue !== undefined && newValue !== oldValue) {
        updates[key] = newValue;

        auditEntries.push({
          userId,
          action: "update_profile",
          field: key,
          oldValue: oldValue ? oldValue.toString() : null,
          newValue: newValue ? newValue.toString() : null,
          ipAddress,
          userAgent,
        });
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No changes detected." });
    }

    // Update user profile in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    // Save audit log entries
    await prisma.auditLog.createMany({ data: auditEntries });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
