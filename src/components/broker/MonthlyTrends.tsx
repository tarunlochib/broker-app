"use client";

interface MonthlyTrendsProps {
  trends: Record<string, { count: number; volume: number }>;
}

export function MonthlyTrends({ trends }: MonthlyTrendsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
  };

  const sortedTrends = Object.entries(trends).sort(([a], [b]) => a.localeCompare(b));
  const maxCount = Math.max(...sortedTrends.map(([, data]) => data.count));
  const maxVolume = Math.max(...sortedTrends.map(([, data]) => data.volume));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
        <p className="text-sm text-gray-600 mt-1">Application volume and count over the last 6 months</p>
      </div>

      {sortedTrends.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Start creating applications to see trends</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Application Count Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Applications</h4>
            <div className="space-y-3">
              {sortedTrends.map(([month, data]) => (
                <div key={month} className="flex items-center space-x-4">
                  <div className="w-16 text-xs text-gray-500">
                    {formatMonth(month)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-xs font-medium text-gray-900 text-right">
                    {data.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Volume Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Loan Volume</h4>
            <div className="space-y-3">
              {sortedTrends.map(([month, data]) => (
                <div key={month} className="flex items-center space-x-4">
                  <div className="w-16 text-xs text-gray-500">
                    {formatMonth(month)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.volume / maxVolume) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-xs font-medium text-gray-900 text-right">
                    {formatCurrency(data.volume)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sortedTrends.reduce((sum, [, data]) => sum + data.count, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(sortedTrends.reduce((sum, [, data]) => sum + data.volume, 0))}
              </div>
              <div className="text-xs text-gray-500">Total Volume</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
