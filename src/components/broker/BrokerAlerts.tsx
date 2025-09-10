"use client";

interface BrokerAlertsProps {
  pendingDocuments: number;
  urgentApplications: number;
  overdueTasks: number;
}

export function BrokerAlerts({ pendingDocuments, urgentApplications, overdueTasks }: BrokerAlertsProps) {
  const alerts = [
    {
      id: 'pending-docs',
      title: 'Pending Documents',
      count: pendingDocuments,
      message: `${pendingDocuments} document${pendingDocuments !== 1 ? 's' : ''} require${pendingDocuments !== 1 ? '' : 's'} review`,
      type: 'warning',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      action: 'Review Documents',
      href: '/documents/pending',
    },
    {
      id: 'urgent-apps',
      title: 'Urgent Applications',
      count: urgentApplications,
      message: `${urgentApplications} application${urgentApplications !== 1 ? 's' : ''} under review`,
      type: 'info',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: 'View Applications',
      href: '/applications?status=under_review',
    },
    {
      id: 'overdue-tasks',
      title: 'Overdue Tasks',
      count: overdueTasks,
      message: overdueTasks > 0 ? `${overdueTasks} task${overdueTasks !== 1 ? 's' : ''} overdue` : 'All tasks on track',
      type: overdueTasks > 0 ? 'error' : 'success',
      icon: overdueTasks > 0 ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: overdueTasks > 0 ? 'View Tasks' : 'All Good',
      href: '/tasks',
    },
  ];

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const hasAlerts = alerts.some(alert => alert.count > 0);

  if (!hasAlerts) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">All caught up!</h3>
            <p className="text-sm text-green-700 mt-1">No urgent tasks or pending items at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {alerts.map((alert, index) => {
        const styles = getAlertStyles(alert.type);
        return (
          <div
            key={alert.id}
            className={`${styles.bg} border ${styles.border} rounded-xl p-4 hover:shadow-md transition-shadow duration-200`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`${styles.icon}`}>
                  {alert.icon}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${styles.text}`}>
                    {alert.title}
                  </h3>
                  {alert.count > 0 && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
                      {alert.count}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${styles.text} mt-1`}>
                  {alert.message}
                </p>
                {alert.count > 0 && (
                  <div className="mt-3">
                    <a
                      href={alert.href}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white rounded-lg ${styles.button} transition-colors duration-200`}
                    >
                      {alert.action}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
