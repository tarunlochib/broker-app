"use client";
import { useState } from "react";
import { DocumentList } from "./DocumentList";
import { CommentsSection } from "./CommentsSection";

interface EnhancedApplicationViewProps {
  application: any;
  role: string;
  applicationId: string;
}

export function EnhancedApplicationView({ application, role, applicationId }: EnhancedApplicationViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "employment", label: "Employment", icon: "💼" },
    { id: "property", label: "Property", icon: "🏠" },
    { id: "financial", label: "Financial", icon: "💰" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "comments", label: "Comments", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20 lg:pb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Application Header */}
          <ApplicationHeader application={application} applicationId={applicationId} role={role} />

          {/* Tab Navigation - Mobile Friendly */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              {/* Mobile Tab Navigation */}
              <div className="block sm:hidden">
                <nav className="flex overflow-x-auto scrollbar-hide px-4 py-2" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 py-2 px-3 mx-1 rounded-lg font-medium text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600 border border-blue-200"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-base">{tab.icon}</span>
                        <span className="text-xs">{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Desktop Tab Navigation */}
              <div className="hidden sm:block">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "overview" && <OverviewTab application={application} />}
              {activeTab === "personal" && <PersonalTab application={application} />}
              {activeTab === "employment" && <EmploymentTab application={application} />}
              {activeTab === "property" && <PropertyTab application={application} />}
              {activeTab === "financial" && <FinancialTab application={application} />}
              {activeTab === "documents" && <DocumentTab application={application} />}
              {activeTab === "comments" && <CommentsTab applicationId={applicationId} />}
            </div>
          </div>

          {/* Mobile Submit Button - Fixed at Bottom */}
          {role !== "admin" && role !== "broker" && application.status === "draft" && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to submit this application? Once submitted, you won't be able to edit it.")) {
                    try {
                      const response = await fetch(`/api/applications/${application.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          status: 'submitted'
                        }),
                      });
                      
                      if (response.ok) {
                        window.location.reload();
                      } else {
                        const errorData = await response.json().catch(() => ({}));
                        alert(`Failed to submit application: ${errorData.error || 'Unknown error'}`);
                      }
                    } catch (error) {
                      alert('Failed to submit application. Please try again.');
                    }
                  }
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Application
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Tab Components
function OverviewTab({ application }: { application: any }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard
          title="Loan Amount"
          value={formatMoney(application.loanAmount)}
          icon="💳"
          color="blue"
        />
        <MetricCard
          title="Purchase Price"
          value={formatMoney(application.purchasePrice)}
          icon="🏠"
          color="green"
        />
        <MetricCard
          title="LVR"
          value={application.lvr ? `${application.lvr}%` : "—"}
          icon="📊"
          color="purple"
        />
        <MetricCard
          title="Annual Income"
          value={formatMoney(application.annualIncome)}
          icon="💰"
          color="emerald"
        />
      </div>

      {/* Application Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-blue-600">📅</span>
          Application Timeline
        </h3>
        <TimelineComponent application={application} />
      </div>
    </div>
  );
}

function PersonalTab({ application }: { application: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Personal Details" icon="👤" color="blue">
        <InfoItem label="First Name" value={application.firstName} />
        <InfoItem label="Last Name" value={application.lastName} />
        <InfoItem label="Date of Birth" value={application.dob} type="date" />
        <InfoItem label="Phone Number" value={application.phone} />
        <InfoItem label="Marital Status" value={application.maritalStatus} />
        <InfoItem label="Dependents" value={application.dependents} type="number" />
      </InfoCard>
      
      <InfoCard title="Address Information" icon="📍" color="green">
        <InfoItem label="Current Address" value={application.currentAddress} />
      </InfoCard>
    </div>
  );
}

function EmploymentTab({ application }: { application: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Employment Details" icon="💼" color="purple">
        <InfoItem label="Employment Status" value={application.employmentStatus} />
        <InfoItem label="Employer Name" value={application.employerName} />
        <InfoItem label="Occupation" value={application.occupation} />
        <InfoItem label="Employment Start Date" value={application.employmentStartDate} type="date" />
        <InfoItem label="Income Type" value={application.incomeType} />
        <InfoItem label="ABN" value={application.abn} />
      </InfoCard>
      
      <InfoCard title="Income Information" icon="💰" color="emerald">
        <InfoItem label="Annual Income" value={application.annualIncome} type="money" />
      </InfoCard>
    </div>
  );
}

function PropertyTab({ application }: { application: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Property Details" icon="🏠" color="orange">
        <InfoItem label="Property Address" value={application.propertyAddress} />
        <InfoItem label="Property Type" value={application.propertyType} />
        <InfoItem label="Occupancy" value={application.occupancy} />
        <InfoItem label="Loan Purpose" value={application.loanPurpose} />
      </InfoCard>
      
      <InfoCard title="Loan Information" icon="💳" color="blue">
        <InfoItem label="Purchase Price" value={application.purchasePrice} type="money" />
        <InfoItem label="Loan Amount" value={application.loanAmount} type="money" />
        <InfoItem label="Deposit" value={application.deposit} type="money" />
        <InfoItem label="LVR" value={application.lvr ? `${application.lvr}%` : null} />
      </InfoCard>
    </div>
  );
}

function FinancialTab({ application }: { application: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <InfoCard title="Assets" icon="💎" color="emerald">
        {renderFinancialData(application.assets, 'assets')}
      </InfoCard>
      
      <InfoCard title="Liabilities" icon="📉" color="red">
        {renderFinancialData(application.liabilities, 'liabilities')}
      </InfoCard>
      
      <InfoCard title="Expenses" icon="💸" color="orange">
        {renderFinancialData(application.expenses, 'expenses')}
      </InfoCard>
    </div>
  );
}

function DocumentTab({ application }: { application: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
        <div className="text-sm text-gray-500">
          {application.documents?.length || 0} documents
        </div>
      </div>
      <DocumentList documents={application.documents || []} />
    </div>
  );
}

function CommentsTab({ applicationId }: { applicationId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <h3 className="text-lg font-semibold text-gray-900">Comments & Notes</h3>
      </div>
      <CommentsSection applicationId={applicationId} />
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, icon, color }: { 
  title: string; 
  value: string; 
  icon: string; 
  color: string; 
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    emerald: "from-emerald-500 to-emerald-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white flex-shrink-0 ml-2`}>
          <span className="text-sm sm:text-lg lg:text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, color, children }: { 
  title: string; 
  icon: string; 
  color: string; 
  children: React.ReactNode; 
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100",
    green: "from-green-50 to-green-100",
    purple: "from-purple-50 to-purple-100",
    emerald: "from-emerald-50 to-emerald-100",
    orange: "from-orange-50 to-orange-100",
    red: "from-red-50 to-red-100",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} px-6 py-4 border-b border-gray-200`}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value, type = "text" }: { 
  label: string; 
  value: any; 
  type?: "text" | "money" | "date" | "number"; 
}) {
  const formatValue = () => {
    if (value == null || value === "") return "—";
    
    switch (type) {
      case "money":
        return formatMoney(value);
      case "date":
        return new Date(value).toLocaleDateString();
      case "number":
        return value.toString();
      default:
        return value;
    }
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{formatValue()}</span>
    </div>
  );
}

function TimelineComponent({ application }: { application: any }) {
  const timeline = [
    { date: application.createdAt, event: "Application Created", status: "completed" },
    { date: application.updatedAt, event: "Last Updated", status: "completed" },
    { date: null, event: "Under Review", status: application.status === "under_review" ? "current" : "pending" },
    { date: null, event: "Approved", status: application.status === "completed" ? "completed" : "pending" },
  ];

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${
            item.status === "completed" ? "bg-green-500" :
            item.status === "current" ? "bg-blue-500" :
            "bg-gray-300"
          }`}></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{item.event}</div>
            {item.date && (
              <div className="text-xs text-gray-500">
                {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderFinancialData(data: any, type: string) {
  if (!data) return <div className="text-sm text-gray-500">No data available</div>;
  
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch {
      return <div className="text-sm text-gray-500">Invalid data</div>;
    }
  }
  
  if (!parsedData || Object.keys(parsedData).length === 0) {
    return <div className="text-sm text-gray-500">No data available</div>;
  }
  
  const fields = {
    assets: [
      { key: 'savings', label: 'Savings' },
      { key: 'otherProperty', label: 'Other Property' },
      { key: 'shares', label: 'Shares' },
      { key: 'super', label: 'Superannuation' },
      { key: 'other', label: 'Other Assets' },
    ],
    liabilities: [
      { key: 'cardsLimit', label: 'Credit Cards Limit' },
      { key: 'cardsBalance', label: 'Credit Cards Balance' },
      { key: 'personal', label: 'Personal Loans' },
      { key: 'auto', label: 'Auto Loans' },
      { key: 'hecs', label: 'HECS/HELP' },
      { key: 'other', label: 'Other Liabilities' },
    ],
    expenses: [
      { key: 'living', label: 'Monthly Living' },
      { key: 'rent', label: 'Rent' },
      { key: 'childcare', label: 'Childcare' },
      { key: 'insurance', label: 'Insurance' },
      { key: 'other', label: 'Other Expenses' },
    ],
  };
  
  return (
    <div className="space-y-3">
      {fields[type as keyof typeof fields]?.map((field) => (
        <InfoItem
          key={field.key}
          label={field.label}
          value={parsedData[field.key]}
          type="money"
        />
      ))}
    </div>
  );
}

function formatMoney(value?: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-AU", { 
    style: "currency", 
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Application Header Component
function ApplicationHeader({ application, applicationId, role }: { application: any; applicationId: string; role: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 px-8 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.location.href = '/applications'}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back to Applications</span>
          </button>
        </div>

        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          {/* Left Side - Application Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">Application ID</div>
                <div className="text-2xl font-semibold text-slate-800 tracking-tight">#{applicationId.slice(0, 8)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {new Date(application.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(application.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Right Side - Status Information */}
          <div className="flex flex-col items-end space-y-3">
            <div className="text-sm font-medium text-slate-500">Current Status</div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDotColor(application.status)}`}></div>
                <span className="text-sm font-semibold text-slate-700">{getStatusLabel(application.status)}</span>
              </div>
            </div>
            
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(application.status)}`}
                style={{ width: `${getProgressPercentage(application.status)}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">{getProgressPercentage(application.status)}% Complete</div>
          </div>
        </div>

        {/* Action Buttons Row - Mobile Friendly */}
        <div className="border-t border-gray-200 pt-4">
          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Quick Actions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButtons application={application} role={role} />
            </div>
          </div>
          
          {/* Mobile Actions - 3 Dots Menu */}
          <div className="lg:hidden flex justify-end">
            <MobileActionsMenu application={application} role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Actions Menu Component
function MobileActionsMenu({ application, role }: { application: any; role: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-30">
      {/* 3 Dots Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform">
            <div className="py-2">
              {/* Edit */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = `/applications/${application.id}/edit`;
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Application
              </button>

              {/* Status Update (for admins/brokers) */}
              {role === "admin" || role === "broker" && (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">Update Status</div>
                  <StatusUpdateForm application={application} />
                </div>
              )}

              {/* Delete */}
              {application.status === "draft" && (
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    if (confirm("Are you sure you want to delete this draft application? This action cannot be undone.")) {
                      try {
                        const response = await fetch(`/api/applications/${application.id}`, {
                          method: 'DELETE',
                        });
                        
                        if (response.ok) {
                          window.location.href = '/applications';
                        } else {
                          const error = await response.text();
                          alert(`Failed to delete application: ${error}`);
                        }
                      } catch (error) {
                        alert('Failed to delete application. Please try again.');
                      }
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Application
                </button>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Action Buttons Component
function ActionButtons({ application, role }: { application: any; role: string }) {
  return (
    <>
      {/* Primary Actions */}
      <div className="flex gap-2">
        {/* Edit Button */}
        <button
          onClick={() => window.location.href = `/applications/${application.id}/edit`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md xl:px-4 xl:py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>

        {/* Submit Button (for borrowers with draft applications) */}
        {role !== "admin" && role !== "broker" && application.status === "draft" && (
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to submit this application? Once submitted, you won't be able to edit it.")) {
                try {
                  const response = await fetch(`/api/applications/${application.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      status: 'submitted'
                    }),
                  });
                  
                  if (response.ok) {
                    window.location.reload();
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Failed to submit application: ${errorData.error || 'Unknown error'}`);
                  }
                } catch (error) {
                  alert('Failed to submit application. Please try again.');
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md xl:px-4 xl:py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit
          </button>
        )}

        {/* Status Update (for admins/brokers) */}
        {role === "admin" || role === "broker" ? (
          <StatusUpdateForm application={application} />
        ) : null}
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2">
        {/* Delete Button (for draft applications) */}
        {application.status === "draft" && (
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this draft application? This action cannot be undone.")) {
                try {
                  const response = await fetch(`/api/applications/${application.id}`, {
                    method: 'DELETE',
                  });
                  
                  if (response.ok) {
                    window.location.href = '/applications';
                  } else {
                    const error = await response.text();
                    alert(`Failed to delete application: ${error}`);
                  }
                } catch (error) {
                  alert('Failed to delete application. Please try again.');
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md xl:px-4 xl:py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}

      </div>
    </>
  );
}

// Status Update Form Component (for admins/brokers)
function StatusUpdateForm({ application }: { application: any }) {
  return (
    <form action={`/api/applications/${application.id}`} method="POST" className="flex gap-2">
      <input type="hidden" name="_method" value="PATCH" />
      <select 
        name="status" 
        defaultValue={application.status} 
        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm xl:px-3 xl:py-2"
      >
        <option value="draft">Draft</option>
        <option value="submitted">Submitted</option>
        <option value="under_review">Under Review</option>
        <option value="completed">Completed</option>
      </select>
      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md xl:px-4 xl:py-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Update Status
      </button>
    </form>
  );
}

// Helper functions
function getStatusDotColor(status: string): string {
  const dotColors: Record<string, string> = {
    draft: "bg-amber-400",
    submitted: "bg-blue-500",
    under_review: "bg-purple-500",
    completed: "bg-emerald-500",
  };
  return dotColors[status] || "bg-gray-400";
}

function getProgressBarColor(status: string): string {
  const progressColors: Record<string, string> = {
    draft: "bg-amber-400",
    submitted: "bg-blue-500",
    under_review: "bg-purple-500",
    completed: "bg-emerald-500",
  };
  return progressColors[status] || "bg-gray-400";
}

function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    completed: "Completed",
  };
  return statusLabels[status] || "Draft";
}

function getProgressPercentage(status: string): number {
  const progressMap: Record<string, number> = {
    draft: 25,
    submitted: 50,
    under_review: 75,
    completed: 100,
  };
  return progressMap[status] ?? 0;
}
