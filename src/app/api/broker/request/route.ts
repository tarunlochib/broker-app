import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = body.name ? String(body.name) : null;
    const company = body.company ? String(body.company) : null;
    const licenseNumber = body.licenseNumber ? String(body.licenseNumber) : null;
    const phone = body.phone ? String(body.phone) : null;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Check if there's already a pending broker request for this email
    const existingRequest = await prisma.brokerRequest.findFirst({ where: { email } });
    if (existingRequest) {
      return NextResponse.json({ error: "Broker request already pending for this email" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user with "pending_broker" role
    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        role: "pending_broker", 
        passwordHash 
      },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        createdAt: true 
      },
    });

    // Create broker request
    const brokerRequest = await prisma.brokerRequest.create({
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        company,
        licenseNumber,
        phone,
        status: "pending",
      }
    });

    // Log the broker request
    await prisma.auditLog.create({
      data: {
        action: "broker_request_submitted",
        meta: {
          userId: user.id,
          email: user.email,
          requestId: brokerRequest.id,
        }
      }
    });

    return NextResponse.json({
      message: "Broker request submitted successfully. Your account will be reviewed by an administrator.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      requestId: brokerRequest.id
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating broker request:", error);
    return NextResponse.json({ 
      error: "Failed to submit broker request" 
    }, { status: 500 });
  }
}
