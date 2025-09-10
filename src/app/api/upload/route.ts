import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(file.name) || "";
  const key = crypto.randomBytes(16).toString("hex") + ext;

  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const target = path.join(uploadDir, key);
  await fs.writeFile(target, buffer);

  const doc = await prisma.document.create({
    data: {
      applicationId: applicationId || "temp", // Use temp for new applications
      s3Key: key,
      fileName: file.name,
      fileType: (file as any).type || "application/octet-stream",
      size: buffer.length,
      uploadedBy: (session.user as any).id,
      status: "pending_scan",
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
