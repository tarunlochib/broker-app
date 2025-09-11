import { Card } from "@/components/ui/Card";

interface KPICardProps {
  title: string;
  value: number;
  color?: "blue" | "amber" | "purple" | "green" | "rose" | "slate";
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700",
  amber: "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700", 
  purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700",
  green: "border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-700",
  rose: "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700",
  slate: "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700",
};

export function KPICard({ title, value, color = "slate", icon, trend }: KPICardProps) {
  return (
    <Card className={`group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out ${colorClasses[color]} relative overflow-hidden p-6 cursor-pointer`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700" />
      </div>
      
      <div className="relative flex flex-col items-center justify-center space-y-3 sm:space-y-4 min-h-[120px] sm:min-h-[140px] p-4 sm:p-6">
        {/* Header with icon */}
        <div className="flex items-center justify-center">
          {icon && (
            <div className="p-2 sm:p-3 rounded-xl bg-white/70 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
              {icon}
            </div>
          )}
        </div>
        
        {/* Centered value with counter animation */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300 ease-out">
            {value}
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center">
          <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{title}</span>
        </div>
        
        {/* Trend indicator */}
        {trend && (
          <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-300 ${
            trend.isPositive ? "text-green-600 group-hover:text-green-700" : "text-red-600 group-hover:text-red-700"
          }`}>
            <svg 
              className={`w-3 h-3 transition-transform duration-300 ${trend.isPositive ? "rotate-0 group-hover:scale-110" : "rotate-180 group-hover:scale-110"}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="group-hover:font-semibold transition-all duration-300">{trend.value}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}

interface KPIGridProps {
  children: React.ReactNode;
}

export function KPIGrid({ children }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {children}
    </div>
  );
}
