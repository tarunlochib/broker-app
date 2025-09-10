import Link from "next/link";
import { FancyCard } from "@/components/ui/FancyCard";

interface ApplicationCardProps {
  id: string;
  createdAt: Date;
  status: string;
  propertyAddress?: string;
  documentCount: number;
  href: string;
}

const statusConfig = {
  draft: { 
    tone: "amber" as const, 
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📝"
  },
  pending: { 
    tone: "amber" as const, 
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏳"
  },
  submitted: { 
    tone: "blue" as const, 
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📤"
  },
  under_review: { 
    tone: "purple" as const, 
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🔍"
  },
  approved: { 
    tone: "green" as const, 
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    icon: "✅"
  },
  completed: { 
    tone: "green" as const, 
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    icon: "🎉"
  },
  rejected: { 
    tone: "rose" as const, 
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    icon: "❌"
  },
};

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    pending: "Pending",
    submitted: "Submitted", 
    under_review: "Under Review",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
  };
  return map[status] ?? status;
}

export function ApplicationCard({ 
  id, 
  createdAt, 
  status, 
  propertyAddress, 
  documentCount, 
  href 
}: ApplicationCardProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  
  return (
    <FancyCard tone={config.tone} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      <Link href={href} className="block">
        <div className="space-y-4">
          {/* Header with animated elements */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {config.icon}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {new Date(createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                #{id.slice(0, 8)}
              </div>
            </div>
            <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.badgeColor} group-hover:scale-105 transition-transform duration-300`}>
              {formatStatus(status)}
            </div>
          </div>

          {/* Content with better visual hierarchy */}
          <div className="space-y-3">
            <div className="font-semibold text-gray-900 text-base group-hover:text-blue-700 transition-colors duration-300">
              Mortgage Application
            </div>
            {propertyAddress && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="line-clamp-2">{propertyAddress}</span>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{getProgressPercentage(status)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(status)}`}
                style={{ width: `${getProgressPercentage(status)}%` }}
              />
            </div>
          </div>

          {/* Footer with enhanced interactions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{documentCount} documents</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
              <span>View details</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </FancyCard>
  );
}

function getProgressPercentage(status: string): number {
  const progressMap: Record<string, number> = {
    draft: 25,
    pending: 40,
    submitted: 50,
    under_review: 75,
    approved: 100,
    completed: 100,
    rejected: 100, // Rejected applications are also "complete" in terms of process
  };
  return progressMap[status] ?? 0;
}

function getProgressColor(status: string): string {
  const colorMap: Record<string, string> = {
    draft: "bg-amber-500",
    pending: "bg-yellow-500",
    submitted: "bg-blue-500",
    under_review: "bg-purple-500",
    approved: "bg-green-500",
    completed: "bg-green-500",
    rejected: "bg-red-500",
  };
  return colorMap[status] ?? "bg-gray-500";
}
