"use client";

import { useState } from "react";
import { BrokerStats } from "./BrokerStats";
import { ApplicationManagement } from "./ApplicationManagement";
import { ClientManagement } from "./ClientManagement";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";

interface BrokerDashboardProps {
  applications: any[];
  clients: any[];
  stats: {
    totalApplications: number;
    totalClients: number;
    totalLoanVolume: number;
    averageLoanAmount: number;
    statusCounts: Record<string, number>;
  };
  recentActivity: any[];
}

export function BrokerDashboard({ 
  applications, 
  clients, 
  stats, 
  recentActivity 
}: BrokerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'clients'>('overview');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broker Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage applications, clients, and track your mortgage business performance
            </p>
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <BrokerStats stats={stats} />
      </div>

      {/* Navigation Tabs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clients ({clients.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentActivity activities={recentActivity} />
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-lg font-semibold text-yellow-600">
                      {stats.statusCounts['pending'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Under Review</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {stats.statusCounts['under_review'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="text-lg font-semibold text-green-600">
                      {stats.statusCounts['approved'] || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rejected</span>
                    <span className="text-lg font-semibold text-red-600">
                      {stats.statusCounts['rejected'] || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Loan Amount</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${stats.averageLoanAmount.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Volume</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${stats.totalLoanVolume.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <ApplicationManagement applications={applications} />
        )}

        {activeTab === 'clients' && (
          <ClientManagement clients={clients} />
        )}
      </div>
    </div>
  );
}
