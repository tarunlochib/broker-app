"use client";

export function ApplicationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export function ApplicationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Filters Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Application Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ApplicationCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
