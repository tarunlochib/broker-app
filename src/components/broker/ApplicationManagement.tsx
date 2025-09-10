"use client";

import { useState } from "react";
import Link from "next/link";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ApplicationActions } from "./ApplicationActions";

interface ApplicationManagementProps {
  applications: any[];
}

export function ApplicationManagement({ applications }: ApplicationManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name":
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "amount":
        return (b.loanAmount || 0) - (a.loanAmount || 0);
      default:
        return 0;
    }
  });

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search Applications</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, property, or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="amount">Loan Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Applications ({filteredApplications.length})
          </h3>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No applications have been submitted yet."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application, index) => (
              <div
                key={application.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {application.firstName?.charAt(0) || application.user?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {application.firstName && application.lastName
                              ? `${application.firstName} ${application.lastName}`
                              : application.user?.name || 'Unknown Client'
                            }
                          </h4>
                          <ApplicationStatusBadge status={application.status} />
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{application.user?.email}</span>
                          <span>•</span>
                          <span>{formatDate(application.createdAt)}</span>
                          {application.propertyAddress && (
                            <>
                              <span>•</span>
                              <span className="truncate">{application.propertyAddress}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(application.loanAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.documents?.length || 0} documents
                      </div>
                    </div>
                    
                    <ApplicationActions application={application} />
                  </div>
                </div>

                {/* Recent Comments */}
                {application.comments && application.comments.length > 0 && (
                  <div className="mt-4 pl-14">
                    <div className="text-xs text-gray-500 mb-2">Recent Activity:</div>
                    {application.comments.slice(0, 2).map((comment: any) => (
                      <div key={comment.id} className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{comment.user?.name || comment.user?.email}:</span> {comment.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
