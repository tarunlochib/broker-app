import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ApplicationHeader } from "@/components/application/ApplicationHeader";
import { ApplicationSidebar } from "@/components/application/ApplicationSidebar";
import { DetailCard, DetailItem } from "@/components/application/DetailCard";
import { DocumentList } from "@/components/application/DocumentList";
import { CommentsSection } from "@/components/application/CommentsSection";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();
  const role = (session.user as any).role as string;
  const userId = (session.user as any).id as string;

  const app = await prisma.application.findUnique({
    where: { id },
    include: { documents: true },
  });
  if (!app) return notFound();
  if (!(role === "admin" || role === "broker") && app.userId !== userId) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Application Header */}
          <ApplicationHeader 
            id={id} 
            status={app.status} 
            createdAt={app.createdAt} 
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <ApplicationSidebar application={app} role={role} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
          {/* Personal Information */}
          <DetailCard 
            title="Personal Information"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <DetailItem label="First Name" value={(app as any).firstName} />
            <DetailItem label="Last Name" value={(app as any).lastName} />
            <DetailItem label="Date of Birth" value={(app as any).dob} type="date" />
            <DetailItem label="Phone Number" value={(app as any).phone} />
            <DetailItem label="Current Address" value={(app as any).currentAddress} />
            <DetailItem label="Marital Status" value={(app as any).maritalStatus} />
            <DetailItem label="Dependents" value={(app as any).dependents} type="number" />
          </DetailCard>

          {/* Employment & Income */}
          <DetailCard 
            title="Employment & Income"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            }
          >
            <DetailItem label="Employment Status" value={(app as any).employmentStatus} />
            <DetailItem label="Employer Name" value={(app as any).employerName} />
            <DetailItem label="Occupation" value={(app as any).occupation} />
            <DetailItem label="Employment Start Date" value={(app as any).employmentStartDate} type="date" />
            <DetailItem label="Income Type" value={(app as any).incomeType} />
            <DetailItem label="Annual Income" value={(app as any).annualIncome} type="money" />
            <DetailItem label="ABN" value={(app as any).abn} />
          </DetailCard>

          {/* Property & Loan */}
          <DetailCard 
            title="Property & Loan Details"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          >
            <DetailItem label="Property Address" value={(app as any).propertyAddress} />
            <DetailItem label="Purchase Price" value={(app as any).purchasePrice} type="money" />
            <DetailItem label="Loan Purpose" value={(app as any).loanPurpose} />
            <DetailItem label="Property Type" value={(app as any).propertyType} />
            <DetailItem label="Occupancy" value={(app as any).occupancy} />
            <DetailItem label="Loan Amount" value={(app as any).loanAmount} type="money" />
            <DetailItem label="Deposit" value={(app as any).deposit} type="money" />
            <DetailItem label="LVR" value={(app as any).lvr ? `${(app as any).lvr}%` : null} />
          </DetailCard>

          {/* Financial Information */}
          <DetailCard 
            title="Assets"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          >
            {renderAssets((app as any).assets)}
          </DetailCard>

          <DetailCard 
            title="Liabilities"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            }
          >
            {renderLiabilities((app as any).liabilities)}
          </DetailCard>

          <DetailCard 
            title="Monthly Expenses"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          >
            {renderExpenses((app as any).expenses)}
          </DetailCard>

          {/* Documents */}
          <DocumentList documents={app.documents} />

          {/* Comments Section */}
          <DetailCard 
            title="Comments & Notes"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          >
            <CommentsSection applicationId={id} />
          </DetailCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function renderAssets(a: any) {
  if (!a) return <div className="col-span-2 text-sm text-gray-500">No asset information provided</div>;
  
  // Parse JSON if it's a string
  let assetsData = a;
  if (typeof a === 'string') {
    try {
      assetsData = JSON.parse(a);
    } catch {
      return <div className="col-span-2 text-sm text-gray-500">Invalid asset data</div>;
    }
  }
  
  if (!assetsData || Object.keys(assetsData).length === 0) {
    return <div className="col-span-2 text-sm text-gray-500">No asset information provided</div>;
  }
  
  return (
    <>
      <DetailItem label="Savings" value={assetsData.savings} type="money" />
      <DetailItem label="Other Property" value={assetsData.otherProperty} type="money" />
      <DetailItem label="Shares" value={assetsData.shares} type="money" />
      <DetailItem label="Superannuation" value={assetsData.super} type="money" />
      <DetailItem label="Other Assets" value={assetsData.other} type="money" />
    </>
  );
}

function renderLiabilities(l: any) {
  if (!l) return <div className="col-span-2 text-sm text-gray-500">No liability information provided</div>;
  
  // Parse JSON if it's a string
  let liabilitiesData = l;
  if (typeof l === 'string') {
    try {
      liabilitiesData = JSON.parse(l);
    } catch {
      return <div className="col-span-2 text-sm text-gray-500">Invalid liability data</div>;
    }
  }
  
  if (!liabilitiesData || Object.keys(liabilitiesData).length === 0) {
    return <div className="col-span-2 text-sm text-gray-500">No liability information provided</div>;
  }
  
  return (
    <>
      <DetailItem label="Credit Cards Limit" value={liabilitiesData.cardsLimit} type="money" />
      <DetailItem label="Credit Cards Balance" value={liabilitiesData.cardsBalance} type="money" />
      <DetailItem label="Personal Loans" value={liabilitiesData.personal} type="money" />
      <DetailItem label="Auto Loans" value={liabilitiesData.auto} type="money" />
      <DetailItem label="HECS/HELP" value={liabilitiesData.hecs} type="money" />
      <DetailItem label="Other Liabilities" value={liabilitiesData.other} type="money" />
    </>
  );
}

function renderExpenses(e: any) {
  if (!e) return <div className="col-span-2 text-sm text-gray-500">No expense information provided</div>;
  
  // Parse JSON if it's a string
  let expensesData = e;
  if (typeof e === 'string') {
    try {
      expensesData = JSON.parse(e);
    } catch {
      return <div className="col-span-2 text-sm text-gray-500">Invalid expense data</div>;
    }
  }
  
  if (!expensesData || Object.keys(expensesData).length === 0) {
    return <div className="col-span-2 text-sm text-gray-500">No expense information provided</div>;
  }
  
  return (
    <>
      <DetailItem label="Monthly Living" value={expensesData.living} type="money" />
      <DetailItem label="Rent" value={expensesData.rent} type="money" />
      <DetailItem label="Childcare" value={expensesData.childcare} type="money" />
      <DetailItem label="Insurance" value={expensesData.insurance} type="money" />
      <DetailItem label="Other Expenses" value={expensesData.other} type="money" />
    </>
  );
}


