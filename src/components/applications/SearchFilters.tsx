"use client";

import { useState } from "react";

interface SearchFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onSortChange: (sort: string) => void;
}

export function SearchFilters({ onSearchChange, onStatusFilter, onSortChange }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onStatusFilter(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
    onSortChange(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
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
              onChange={handleSearchChange}
              placeholder="Search by name, property, or ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={selectedSort}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="status">Status</option>
            <option value="amount">Loan Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
}
