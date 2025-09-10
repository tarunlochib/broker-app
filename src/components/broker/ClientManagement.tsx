"use client";

import { useState } from "react";
import Link from "next/link";

interface ClientManagementProps {
  clients: { id: string; name: string | null; email: string; createdAt: Date; applications: { id: string; status: string; loanAmount: number | null; createdAt: Date }[] }[];
}

export function ClientManagement({ clients }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getClientStatus = (applications: { status: string }[]) => {
    if (applications.length === 0) return { label: 'No Applications', color: 'gray' };
    
    const latestApp = applications[0];
    switch (latestApp.status) {
      case 'approved':
        return { label: 'Active Client', color: 'green' };
      case 'under_review':
        return { label: 'Under Review', color: 'blue' };
      case 'pending':
        return { label: 'Pending', color: 'yellow' };
      case 'rejected':
        return { label: 'Inactive', color: 'red' };
      default:
        return { label: 'Draft', color: 'gray' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search Clients</label>
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
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Clients ({filteredClients.length})
          </h3>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? "Try adjusting your search criteria."
                : "No clients have registered yet."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client, index) => {
              const status = getClientStatus(client.applications);
              return (
                <div
                  key={client.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {client.name?.charAt(0) || client.email.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {client.name || 'Unnamed Client'}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                            status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{client.email}</span>
                          <span>•</span>
                          <span>Joined {formatDate(client.createdAt)}</span>
                          <span>•</span>
                          <span>{client.applications.length} application{client.applications.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {client.applications.length} Application{client.applications.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          Latest: {client.applications.length > 0 ? formatDate(client.applications[0].createdAt) : 'N/A'}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/applications?client=${client.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Applications
                        </Link>

                        <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Applications Summary */}
                  {client.applications.length > 0 && (
                    <div className="mt-4 pl-16">
                      <div className="text-xs text-gray-500 mb-2">Recent Applications:</div>
                      <div className="space-y-1">
                        {client.applications.slice(0, 3).map((app: { id: string; status: string; loanAmount: number | null; createdAt: Date }) => (
                          <div key={app.id} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">#{app.id.slice(-8)}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status.replace('_', ' ')}
                            </span>
                            <span>•</span>
                            <span>{formatDate(app.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
