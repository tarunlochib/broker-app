import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ApplicationSidebarProps {
  application: any;
  role: string;
}

export function ApplicationSidebar({ application, role }: ApplicationSidebarProps) {
  return (
    <aside className="space-y-6 sticky top-8">
      {/* Overview Card */}
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Quick Overview</h3>
          </div>
          
          <div className="space-y-4">
            <OverviewItem 
              label="Property Address" 
              value={application.propertyAddress || "Not specified"} 
              icon="📍"
            />
            <OverviewItem 
              label="Loan Amount" 
              value={formatMoney(application.loanAmount)} 
              icon="💰"
              highlight={true}
            />
            <OverviewItem 
              label="Purchase Price" 
              value={formatMoney(application.purchasePrice)} 
              icon="🏠"
            />
            <OverviewItem 
              label="LVR" 
              value={application.lvr ? `${application.lvr}%` : "Not calculated"} 
              icon="📊"
              highlight={true}
            />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" size="sm" asChild className="w-full justify-start">
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
                <form action={`/api/applications/${application.id}`} method="POST" className="w-full">
                  <input type="hidden" name="_method" value="PATCH" />
                  <input type="hidden" name="status" value="submitted" />
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Application
                  </Button>
                </form>
              )
            )}

            {application.status === "draft" && (
              <form action={`/api/applications/${application.id}`} method="POST" className="w-full">
                <input type="hidden" name="_method" value="DELETE" />
                <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Draft
                </Button>
              </form>
            )}

            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link href="/applications">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </aside>
  );
}

function OverviewItem({ label, value, icon, highlight = false }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
      highlight 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm' 
        : 'bg-gradient-to-r from-gray-50 to-white hover:from-blue-50/50 hover:to-indigo-50/50'
    }`}>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-blue-600' : 'text-gray-500'}`}>
          {label}
        </div>
        <div className={`text-sm font-bold truncate ${highlight ? 'text-blue-900' : 'text-gray-900'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusActions({ application }: { application: any }) {
  return (
    <form action={`/api/applications/${application.id}`} method="POST" className="space-y-2">
      <input type="hidden" name="_method" value="PATCH" />
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Update Status</label>
        <select 
          name="status" 
          defaultValue={application.status} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="completed">Completed</option>
        </select>
        <Button size="sm" className="w-full">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Status
        </Button>
      </div>
    </form>
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
