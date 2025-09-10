"use client";

interface EnhancedBrokerStatsProps {
  stats: {
    totalApplications: number;
    totalClients: number;
    totalLoanVolume: number;
    averageLoanAmount: number;
    statusCounts: Record<string, number>;
    pendingDocumentsCount: number;
  };
}

export function EnhancedBrokerStats({ stats }: EnhancedBrokerStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      change: "+12%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Clients",
      value: stats.totalClients,
      change: "+8%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Total Loan Volume",
      value: formatCurrency(stats.totalLoanVolume),
      change: "+15%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Average Loan",
      value: formatCurrency(stats.averageLoanAmount),
      change: "+5%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Pending Documents",
      value: stats.pendingDocumentsCount,
      change: stats.pendingDocumentsCount > 0 ? "Needs Attention" : "All Clear",
      changeType: stats.pendingDocumentsCount > 0 ? "negative" : "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
    {
      title: "Approval Rate",
      value: stats.statusCounts['approved'] ? 
        Math.round((stats.statusCounts['approved'] / stats.totalApplications) * 100) : 0,
      change: "+3%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={stat.title}
          className={`bg-white border-2 ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.bgColor} rounded-lg p-3`}>
              <div className={stat.textColor}>
                {stat.icon}
              </div>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}{stat.title === 'Approval Rate' ? '%' : ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
