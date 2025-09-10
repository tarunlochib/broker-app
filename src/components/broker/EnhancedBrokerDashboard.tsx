"use client";

import { useState } from "react";
import { BrokerStats } from "./BrokerStats";
import { ApplicationManagement } from "./ApplicationManagement";
import { ClientManagement } from "./ClientManagement";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { PendingDocuments } from "./PendingDocuments";
import { MonthlyTrends } from "./MonthlyTrends";
import { TopClients } from "./TopClients";
import { BrokerAlerts } from "./BrokerAlerts";

interface EnhancedBrokerDashboardProps {
  applications: any[];
  clients: any[];
  stats: {
    totalApplications: number;
    totalClients: number;
    totalLoanVolume: number;
    averageLoanAmount: number;
    statusCounts: Record<string, number>;
    pendingDocumentsCount?: number;
  };
  recentActivity: any[];
  pendingDocuments: any[];
  monthlyTrends: Record<string, { count: number; volume: number }>;
  topClients: any[];
}

export function EnhancedBrokerDashboard({ 
  applications, 
  clients, 
  stats, 
  recentActivity,
  pendingDocuments,
  monthlyTrends,
  topClients
}: EnhancedBrokerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'clients' | 'analytics'>('overview');

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Broker Dashboard</h1>
            <p className="text-lg text-gray-600">
              Manage applications, track performance, and grow your mortgage business
            </p>
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <BrokerStats stats={stats} />
      </div>

      {/* Broker Alerts */}
      <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <BrokerAlerts 
          pendingDocuments={pendingDocuments?.length || 0}
          urgentApplications={applications.filter(app => app.status === 'under_review').length}
          overdueTasks={0}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clients ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <RecentActivity activities={recentActivity} />
              <PendingDocuments documents={pendingDocuments} />
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <TopClients clients={topClients} />
              <div className="bg-white border border-gray-200 rounded-xl p-6">
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
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <ApplicationManagement applications={applications} />
        )}

        {activeTab === 'clients' && (
          <ClientManagement clients={clients} />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <MonthlyTrends trends={monthlyTrends} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopClients clients={topClients} />
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-lg font-semibold text-green-600">
                      {stats.statusCounts['approved'] ? 
                        Math.round((stats.statusCounts['approved'] / stats.totalApplications) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Processing Time</span>
                    <span className="text-lg font-semibold text-blue-600">7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <span className="text-lg font-semibold text-purple-600">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
