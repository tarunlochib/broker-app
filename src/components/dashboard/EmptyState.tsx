import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionHref,
  icon 
}: EmptyStateProps) {
  return (
    <Card className="text-center py-12 px-6">
      <div className="space-y-4">
        {icon && (
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">{description}</p>
        </div>
        {actionText && actionHref && (
          <div className="pt-4">
            <a 
              href={actionHref}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {actionText}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
