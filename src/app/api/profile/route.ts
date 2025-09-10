import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await requireAuth();
  const userId = (session.user as { id: string }).id;
  
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim() || null;
    
    await prisma.user.update({ 
      where: { id: userId }, 
      data: { name } 
    });
    
    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}


