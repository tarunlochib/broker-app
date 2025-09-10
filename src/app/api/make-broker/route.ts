import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, secretKey } = body;

    // Simple secret key check
    if (secretKey !== "MAKE_BROKER_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user role to broker
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'broker' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: "User role updated to broker successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
