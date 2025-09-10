import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  actionText, 
  actionHref,
  children 
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="hidden sm:block w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600 max-w-2xl">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {children}
        {actionText && actionHref && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
          >
            <Link href={actionHref}>
              <span className="flex items-center gap-2">
                {actionText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
