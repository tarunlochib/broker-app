import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await requireAuth();
  const formData = await req.formData();
  const file = formData.get("file");
  const applicationId = String(formData.get("applicationId") ?? "");
  const category = String(formData.get("category") ?? "other");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    // For now, we'll store file metadata without actual file storage
    // In production, you should use Supabase Storage or AWS S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop() || "";
    const key = crypto.randomBytes(16).toString("hex") + "." + ext;

    // Store file info in database (file content would go to cloud storage)
    const doc = await prisma.document.create({
      data: {
        applicationId: applicationId || "temp",
        s3Key: key, // This would be the cloud storage key
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        size: buffer.length,
        uploadedBy: (session.user as { id: string }).id,
        category: category,
        status: "pending_scan",
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
