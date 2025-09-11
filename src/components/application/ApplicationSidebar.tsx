"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ApplicationSidebarProps {
  application: any;
  role: string;
}

export function ApplicationSidebar({ application, role }: ApplicationSidebarProps) {
  return (
    <aside className="space-y-6 sticky top-8">
      {/* Enhanced Overview Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Overview</h3>
          </div>
          
          <div className="space-y-4">
            <EnhancedOverviewItem 
              label="Property Address" 
              value={application.propertyAddress || "Not specified"} 
              icon="📍"
            />
            <EnhancedOverviewItem 
              label="Loan Amount" 
              value={formatMoney(application.loanAmount)} 
              icon="💰"
              highlight={true}
            />
            <EnhancedOverviewItem 
              label="Purchase Price" 
              value={formatMoney(application.purchasePrice)} 
              icon="🏠"
            />
            <EnhancedOverviewItem 
              label="LVR" 
              value={application.lvr ? `${application.lvr}%` : "Not calculated"} 
              icon="📊"
              highlight={true}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" size="sm" asChild className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
              <Link href={`/applications/${application.id}/edit`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </Link>
            </Button>

            {role === "admin" || role === "broker" ? (
              <StatusActions application={application} />
            ) : (
              application.status === "draft" && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200"
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
                          // Reload the page to show updated status
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
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Application
                </Button>
              )
            )}

            {application.status === "draft" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
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
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Draft
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="w-full justify-start hover:bg-gray-50 transition-all duration-200">
              <Link href="/applications">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function EnhancedOverviewItem({ label, value, icon, highlight = false }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`group/item p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-transparent hover:border-blue-200/50 hover:shadow-sm ${
      highlight ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-200/50' : ''
    }`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <div className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-blue-600' : 'text-gray-600'}`}>
            {label}
          </div>
        </div>
        <div className={`text-base font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'} transition-colors duration-200`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusActions({ application }: { application: any }) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-gray-700">Update Status</div>
      <form action={`/api/applications/${application.id}`} method="POST" className="space-y-3">
        <input type="hidden" name="_method" value="PATCH" />
        <select 
          name="status" 
          defaultValue={application.status} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors duration-200"
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="completed">Completed</option>
        </select>
        <Button size="sm" className="w-full hover:bg-blue-600 transition-all duration-200">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Status
        </Button>
      </form>
    </div>
  );
}

function formatMoney(value?: number | null): string {
  if (value == null) return "Not specified";
  return new Intl.NumberFormat("en-AU", { 
    style: "currency", 
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
