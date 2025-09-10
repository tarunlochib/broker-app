"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { SearchFilters } from "@/components/applications/SearchFilters";
import { EmptyState } from "@/components/applications/EmptyState";
import { ApplicationsLoadingSkeleton } from "@/components/applications/ApplicationSkeleton";

interface Application {
  id: string;
  status: string;
  createdAt: Date;
  firstName?: string | null;
  lastName?: string | null;
  propertyAddress?: string | null;
  loanAmount?: number | null;
  annualIncome?: number | null;
}

interface ApplicationsPageProps {
  initialApplications: Application[];
  role: string;
}

export function ApplicationsPage({ initialApplications, role }: ApplicationsPageProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.firstName?.toLowerCase().includes(searchLower)) ||
        (app.lastName?.toLowerCase().includes(searchLower)) ||
        (app.propertyAddress?.toLowerCase().includes(searchLower)) ||
        app.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim();
          const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim();
          return nameA.localeCompare(nameB);
        case "status":
          return a.status.localeCompare(b.status);
        case "amount":
          return (b.loanAmount || 0) - (a.loanAmount || 0);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortBy]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "all");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ApplicationsLoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Professional Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="mt-2 text-gray-600">
                Manage and track all mortgage applications
                {filteredApplications.length !== applications.length && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({filteredApplications.length} of {applications.length} shown)
                  </span>
                )}
              </p>
            </div>
            
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Application
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <SearchFilters
              onSearchChange={handleSearchChange}
              onStatusFilter={handleStatusFilter}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Stats Section */}
          {applications.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Statistics</h3>
              <div className={`grid gap-6 ${role === 'borrower' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
                <div className="text-center group hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">{applications.length}</div>
                  <div className="text-sm text-gray-500">Total Applications</div>
                </div>
                {role === 'borrower' && (
                  <div className="text-center group hover:scale-105 transition-transform duration-200">
                    <div className="text-3xl font-bold text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-200">
                      {applications.filter(app => app.status === 'draft').length}
                    </div>
                    <div className="text-sm text-gray-500">Drafts</div>
                  </div>
                )}
                <div className="text-center group hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors duration-200">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div className="text-center group hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-2 group-hover:text-yellow-700 transition-colors duration-200">
                    {applications.filter(app => app.status === 'pending' || app.status === 'under_review').length}
                  </div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
              </div>
            </div>
          )}

          {/* Consistent Applications Grid */}
          {filteredApplications.length === 0 ? (
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application, index) => (
                <div
                  key={application.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${300 + index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <ApplicationCard
                    application={application}
                    role={role}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
