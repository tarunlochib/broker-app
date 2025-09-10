"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ApplicationCardProps {
  application: {
    id: string;
    status: string;
    createdAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    propertyAddress?: string | null;
    loanAmount?: number | null;
    annualIncome?: number | null;
  };
  role: string;
}

export function ApplicationCard({ application, role }: ApplicationCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'under_review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'under_review':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        animationDelay: `${Math.random() * 100}ms`,
      }}
    >
      {/* Professional Card */}
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {application.firstName && application.lastName 
                ? `${application.firstName} ${application.lastName}` 
                : `Application #${application.id.slice(-8)}`
              }
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(application.createdAt)}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span className="ml-1.5 capitalize">{application.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6 flex-1">
          {application.propertyAddress && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 line-clamp-2">{application.propertyAddress}</p>
              </div>
            </div>
          )}
          
          {application.loanAmount && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(application.loanAmount)}</p>
                <p className="text-xs text-gray-500">Loan Amount</p>
              </div>
            </div>
          )}
          
          {application.annualIncome && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(application.annualIncome)}</p>
                <p className="text-xs text-gray-500">Annual Income</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Link
              href={`/applications/${application.id}`}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </Link>
            
            {(role === 'admin' || role === 'broker') && (
              <Link
                href={`/applications/${application.id}/edit`}
                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className={`w-2 h-2 rounded-full ${
            application.status === 'approved' ? 'bg-green-400' :
            application.status === 'pending' ? 'bg-yellow-400' :
            application.status === 'rejected' ? 'bg-red-400' :
            application.status === 'under_review' ? 'bg-blue-400' :
            'bg-gray-400'
          }`} />
        </div>
      </div>
    </div>
  );
}