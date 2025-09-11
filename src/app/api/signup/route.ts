import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = body.name ? String(body.name).trim() : null;

    // Validation
    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required" 
      }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Please enter a valid email address" 
      }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 });
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ 
        error: "Password must contain at least one uppercase letter" 
      }, { status: 400 });
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json({ 
        error: "Password must contain at least one lowercase letter" 
      }, { status: 400 });
    }

    if (!/\d/.test(password)) {
      return NextResponse.json({ 
        error: "Password must contain at least one number" 
      }, { status: 400 });
    }

    // Name validation (if provided)
    if (name && (name.length < 2 || name.length > 50)) {
      return NextResponse.json({ 
        error: "Name must be between 2 and 50 characters" 
      }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ 
        error: "An account with this email already exists. Please try signing in instead." 
      }, { status: 409 });
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, role: "borrower", passwordHash },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({
      message: "Account created successfully",
      user
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle database errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ 
        error: "An account with this email already exists" 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create account. Please try again later." 
    }, { status: 500 });
  }
}


