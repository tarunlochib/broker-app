"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function QuickActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryActions = [
    {
      href: "/applications/new",
      label: "New Application",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Create a new mortgage application"
    },
    {
      href: "/applications",
      label: "View Applications",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-gray-600 hover:bg-gray-700",
      description: "Manage all applications"
    }
  ];

  const secondaryActions = [
    {
      href: "/documents/pending",
      label: "Review Documents",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-yellow-600 hover:bg-yellow-700",
      description: "Review pending documents"
    },
    {
      href: "/clients",
      label: "Manage Clients",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-green-600 hover:bg-green-700",
      description: "View and manage clients"
    },
    {
      href: "/reports",
      label: "Generate Reports",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-purple-600 hover:bg-purple-700",
      description: "View performance reports"
    },
    {
      href: "/settings",
      label: "Settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "bg-gray-500 hover:bg-gray-600",
      description: "Account and system settings"
    }
  ];

  return (
    <>
      <div className="relative">
        {/* Primary Actions */}
        <div className="flex space-x-3">
          {primaryActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={`inline-flex items-center px-4 py-2 ${action.color} text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              title={action.description}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </Link>
          ))}

          {/* More Actions Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="ml-2">More</span>
          </button>
        </div>
      </div>

      {/* Secondary Actions Dropdown - Rendered as portal */}
      {isExpanded && mounted && createPortal(
        <>
          <div className="fixed top-20 right-4 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] animate-fade-in-up">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                Additional Actions
              </div>
              {secondaryActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className={`w-8 h-8 ${action.color.replace('hover:', '')} rounded-lg flex items-center justify-center mr-3`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Click outside to close */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsExpanded(false)}
          />
        </>,
        document.body
      )}
    </>
  );
}
