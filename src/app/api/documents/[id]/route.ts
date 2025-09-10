import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { id } = params;
    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["pending_scan", "approved", "rejected", "needs_resubmission"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const document = await prisma.document.update({
      where: { id },
      data: { 
        status,
        ...(notes && { notes })
      },
      include: {
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    // Log the document status change
    await prisma.auditLog.create({
      data: {
        action: "document_status_change",
        meta: {
          documentId: id,
          newStatus: status,
          applicationId: document.applicationId,
          notes: notes || null,
        }
      }
    });

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error updating document status:", error);
    return NextResponse.json({ error: "Failed to update document status" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { id } = params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}
