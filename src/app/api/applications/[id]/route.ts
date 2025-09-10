import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const contentType = req.headers.get('content-type');
  
  // If it's JSON content, it's likely updating application details (borrower)
  if (contentType?.includes('application/json')) {
    return await updateApplicationDetails(req, params);
  }
  
  // If it's form data, it's likely updating status (broker/admin)
  return await updateApplicationStatus(req, params);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return await updateApplicationStatus(req, params);
}

async function updateApplicationDetails(
  req: Request,
  params: Promise<{ id: string }>
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    
    // Check if the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true }
    });
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    if (application.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const body = await req.json();
    
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error updating application details:", error);
    return NextResponse.json({ error: "Failed to update application details" }, { status: 500 });
  }
}

async function updateApplicationStatus(
  req: Request,
  params: Promise<{ id: string }>
) {
  const contentType = req.headers.get('content-type');
  const isFormSubmission = contentType?.includes('application/x-www-form-urlencoded');
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    console.log("Attempting to update application status for ID:", id);
    const session = await requireRole(["broker", "admin"]);
    console.log("User session:", { userId: session.user.id, role: session.user.role });
    
    // Handle both JSON and form data
    let status, notes;
    
    if (contentType?.includes('application/json')) {
      const body = await req.json();
      status = body.status;
      notes = body.notes;
    } else if (isFormSubmission) {
      const formData = await req.formData();
      status = formData.get('status') as string;
      notes = formData.get('notes') as string;
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["pending", "under_review", "approved", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get current application to log old status
    const currentApplication = await prisma.application.findUnique({
      where: { id },
      select: { status: true, userId: true }
    });

    if (!currentApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    // Note: Comment creation removed due to Prisma client issue
    // Comments can be added separately if needed

    // Log the status change
    await prisma.auditLog.create({
      data: {
        action: "status_change",
        meta: {
          applicationId: id,
          oldStatus: currentApplication.status,
          newStatus: status,
          userId: application.userId,
          notes: notes || null,
        }
      }
    });

    // Return appropriate response based on request type
    if (isFormSubmission) {
      // For form submissions, redirect back to the application page
      return NextResponse.redirect(new URL(`/applications/${id}`, req.url));
    } else {
      // For JSON requests (API calls), return JSON data
      return NextResponse.json(application, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    
    if (isFormSubmission) {
      // For form submissions, redirect back with error
      return NextResponse.redirect(new URL(`/applications/${id}?error=update_failed`, req.url));
    } else {
      // For JSON requests, return JSON error
      return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
    }
  }
}