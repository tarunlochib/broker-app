import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await requireAuth();
  const userId = (session.user as any).id as string;
  
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Password change not available for this account" }, { status: 400 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
