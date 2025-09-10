import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, secretKey } = body;

    // Simple secret key check (change this to something secure)
    if (secretKey !== "CREATE_BROKER_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // Check if broker already exists
    const existingBroker = await prisma.user.findUnique({
      where: { email }
    });

    if (existingBroker) {
      return NextResponse.json({ error: "Broker user already exists" }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the broker user
    const broker = await prisma.user.create({
      data: {
        email,
        name,
        role: 'broker',
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      message: "Broker user created successfully",
      broker
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating broker user:", error);
    return NextResponse.json({ error: "Failed to create broker user" }, { status: 500 });
  }
}
