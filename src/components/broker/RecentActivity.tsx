"use client";

interface RecentActivityProps {
  activities: any[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (activity: any) => {
    return (
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>
    );
  };

  const getActivityDescription = (activity: any) => {
    const userName = activity.user?.name || activity.user?.email || 'Unknown User';
    const clientName = activity.application?.firstName && activity.application?.lastName
      ? `${activity.application.firstName} ${activity.application.lastName}`
      : 'Unknown Client';
    
    return (
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{userName}</span> commented on{' '}
          <span className="font-medium">{clientName}</span>'s application
        </p>
        <p className="text-sm text-gray-500 mt-1 truncate">
          "{activity.content}"
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600 mt-1">Latest comments and updates across all applications</p>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">
            Activity will appear here as applications are updated and commented on.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-start space-x-4">
                {getActivityIcon(activity)}
                {getActivityDescription(activity)}
                <div className="flex-shrink-0">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Application
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activity →
          </button>
        </div>
      )}
    </div>
  );
}
