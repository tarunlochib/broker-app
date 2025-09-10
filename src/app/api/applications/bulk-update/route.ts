import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    await requireRole(["broker", "admin"]);
    
    const { applicationIds, status, notes } = await req.json();

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json({ error: "Application IDs are required" }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["pending", "under_review", "approved", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get current applications to log old statuses
    const currentApplications = await prisma.application.findMany({
      where: { id: { in: applicationIds } },
      select: { id: true, status: true, userId: true }
    });

    if (currentApplications.length !== applicationIds.length) {
      return NextResponse.json({ error: "Some applications not found" }, { status: 404 });
    }

    // Update all applications
    const updatedApplications = await prisma.application.updateMany({
      where: { id: { in: applicationIds } },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    // Note: Comment creation removed due to Prisma client issue
    // Comments can be added separately if needed

    // Log the bulk status changes
    const auditLogData = currentApplications.map(app => ({
      action: "bulk_status_change",
      meta: {
        applicationId: app.id,
        oldStatus: app.status,
        newStatus: status,
        userId: app.userId,
        notes: notes || null,
        bulkUpdate: true,
      }
    }));

    await prisma.auditLog.createMany({
      data: auditLogData
    });

    return NextResponse.json({
      message: `Successfully updated ${updatedApplications.count} applications`,
      updatedCount: updatedApplications.count,
      status
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating application statuses:", error);
    return NextResponse.json({ error: "Failed to update application statuses" }, { status: 500 });
  }
}
