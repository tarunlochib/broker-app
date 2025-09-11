import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import EditApplicationForm from "./EditApplicationForm";

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;
  const resolvedParams = await params;
  const app = await prisma.application.findUnique({ where: { id: resolvedParams.id } });
  if (!app) return null;
  if (!(role === "admin" || role === "broker") && app.userId !== userId) return null;
  return (
    <EditApplicationForm initial={{
        id: app.id,
        firstName: (app as any).firstName,
        lastName: (app as any).lastName,
        dob: (app as any).dob as any,
        phone: (app as any).phone,
        currentAddress: (app as any).currentAddress,
        maritalStatus: (app as any).maritalStatus,
        dependents: (app as any).dependents,
        employmentStatus: (app as any).employmentStatus,
        employerName: (app as any).employerName,
        occupation: (app as any).occupation,
        employmentStartDate: (app as any).employmentStartDate as any,
        incomeType: (app as any).incomeType,
        annualIncome: (app as any).annualIncome,
        abn: (app as any).abn,
        propertyAddress: (app as any).propertyAddress,
        purchasePrice: (app as any).purchasePrice,
        loanPurpose: (app as any).loanPurpose,
        propertyType: (app as any).propertyType,
        occupancy: (app as any).occupancy,
        loanAmount: (app as any).loanAmount,
        deposit: (app as any).deposit,
        lvr: (app as any).lvr,
        assets: (app as any).assets as any,
        liabilities: (app as any).liabilities as any,
        expenses: (app as any).expenses as any,
      }} />
  );
}


