import { Card } from "@/components/ui/Card";

interface ApplicationHeaderProps {
  id: string;
  status: string;
  createdAt: Date;
}

export function ApplicationHeader({ id, status, createdAt }: ApplicationHeaderProps) {
  const statusConfig = {
    draft: { 
      color: "from-orange-500 via-red-500 to-pink-500", 
      icon: "📝",
      label: "Draft",
      bgPattern: "bg-gradient-to-br from-orange-100/20 to-red-100/20"
    },
    submitted: { 
      color: "from-blue-500 via-indigo-500 to-purple-500", 
      icon: "📤",
      label: "Submitted",
      bgPattern: "bg-gradient-to-br from-blue-100/20 to-indigo-100/20"
    },
    under_review: { 
      color: "from-purple-500 via-indigo-500 to-blue-500", 
      icon: "🔍",
      label: "Under Review",
      bgPattern: "bg-gradient-to-br from-purple-100/20 to-indigo-100/20"
    },
    completed: { 
      color: "from-green-500 via-emerald-500 to-teal-500", 
      icon: "✅",
      label: "Completed",
      bgPattern: "bg-gradient-to-br from-green-100/20 to-emerald-100/20"
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${config.color} text-white shadow-2xl`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl animate-pulse delay-1000" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-3xl">{config.icon}</span>
              </div>
              <div>
                <div className="text-sm opacity-90 font-medium">Application ID</div>
                <div className="text-3xl font-bold tracking-tight">#{id.slice(0, 8)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {new Date(createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className="text-sm opacity-90 font-medium">Current Status</div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">{config.icon}</span>
                <span className="text-lg font-bold">{config.label}</span>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage(status)}%` }}
              />
            </div>
            <div className="text-xs opacity-75">{getProgressPercentage(status)}% Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
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
