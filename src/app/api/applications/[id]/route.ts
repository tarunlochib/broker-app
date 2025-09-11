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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    
    // Check if the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    // Only allow users to delete their own draft applications
    if (application.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Only allow deletion of draft applications
    if (application.status !== "draft") {
      return NextResponse.json({ error: "Only draft applications can be deleted" }, { status: 400 });
    }
    
    // Delete the application (cascade will handle related records)
    await prisma.application.delete({
      where: { id }
    });
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        action: "application_deleted",
        meta: {
          applicationId: id,
          userId: userId,
        }
      }
    });
    
    // Redirect to applications list
    return NextResponse.redirect(new URL("/applications", req.url));
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
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
    const userRole = (session.user as { role?: string }).role ?? "borrower";
    
    // Check if the application belongs to the user
    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    if (application.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const body = await req.json();
    
    // Handle status updates for borrowers
    if (body.status && body.status !== application.status) {
      // Borrowers can only change status from "draft" to "submitted"
      if (userRole === "borrower") {
        if (application.status !== "draft") {
          return NextResponse.json({ 
            error: "Only draft applications can be submitted" 
          }, { status: 400 });
        }
        
        if (body.status !== "submitted") {
          return NextResponse.json({ 
            error: "Borrowers can only submit applications (change status to 'submitted')" 
          }, { status: 400 });
        }
        
        // Log the submission
        await prisma.auditLog.create({
          data: {
            action: "application_submitted",
            meta: {
              applicationId: id,
              userId: userId,
              previousStatus: application.status,
              newStatus: body.status
            }
          }
        });
      }
    }
    
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
    
    return NextResponse.json({
      message: body.status === "submitted" ? "Application submitted successfully" : "Application updated successfully",
      application: updatedApplication
    }, { status: 200 });
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