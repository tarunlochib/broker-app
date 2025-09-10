"use client";

import { useState, useEffect } from "react";
import { KPICard } from "@/components/dashboard/KPIGrid";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

interface Application {
  id: string;
  status: string;
  loanAmount: number | null;
  propertyAddress: string | null;
  createdAt: Date;
  documents: any[];
}

interface DashboardProps {
  apps: Application[];
  countBy: Record<string, number>;
  role: string;
  userName?: string;
}

export function AnimatedDashboard({ apps, countBy, role, userName }: DashboardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const kpiCards = [
    {
      id: "total",
      title: "Total Applications",
      value: apps.length,
      color: "blue" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      delay: 0
    },
    ...(role === 'borrower' ? [{
      id: "draft",
      title: "Draft",
      value: countBy["draft"] ?? 0,
      color: "amber" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delay: 100
    }] : []),
    {
      id: "pending",
      title: "Pending",
      value: countBy["pending"] ?? 0,
      color: "amber" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      delay: role === 'borrower' ? 200 : 100
    },
    {
      id: "under_review",
      title: "Under Review",
      value: countBy["under_review"] ?? 0,
      color: "purple" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      delay: role === 'borrower' ? 300 : 200
    },
    {
      id: "completed",
      title: "Completed",
      value: countBy["completed"] ?? 0,
      color: "green" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      delay: role === 'borrower' ? 400 : 300
    }
  ];

  return (
    <div className="space-y-8">
      {/* Animated KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
        role === 'borrower' ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
      }`}>
        {kpiCards.map((card, index) => (
          <div
            key={card.id}
            className={`transform transition-all duration-700 ease-out ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
            style={{
              transitionDelay: `${card.delay}ms`
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`transform transition-all duration-300 ${
              hoveredCard === card.id ? 'scale-105' : 'scale-100'
            }`}>
              <KPICard
                title={card.title}
                value={card.value}
                color={card.color}
                icon={card.icon}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Animated Application Progress Section */}
      {apps.length > 0 && (
        <section className={`transform transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`} style={{ transitionDelay: '600ms' }}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Application Progress Overview
                </h3>
                <p className="text-sm text-gray-600">
                  Track your mortgage journey with real-time status updates
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {apps.length}
                </div>
                <div className="text-xs text-gray-500">Total Applications</div>
              </div>
            </div>
            
            {/* Status Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-amber-600">
                  {countBy["draft"] ?? 0}
                </div>
                <div className="text-xs text-gray-600">Draft</div>
                <div className="text-xs text-gray-500">
                  {Math.round((countBy["draft"] ?? 0) / Math.max(apps.length, 1) * 100)}%
                </div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {(countBy["pending"] ?? 0) + (countBy["submitted"] ?? 0)}
                </div>
                <div className="text-xs text-gray-600">Submitted</div>
                <div className="text-xs text-gray-500">
                  {Math.round(((countBy["pending"] ?? 0) + (countBy["submitted"] ?? 0)) / Math.max(apps.length, 1) * 100)}%
                </div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {countBy["under_review"] ?? 0}
                </div>
                <div className="text-xs text-gray-600">Under Review</div>
                <div className="text-xs text-gray-500">
                  {Math.round((countBy["under_review"] ?? 0) / Math.max(apps.length, 1) * 100)}%
                </div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {(countBy["approved"] ?? 0) + (countBy["completed"] ?? 0)}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
                <div className="text-xs text-gray-500">
                  {Math.round(((countBy["approved"] ?? 0) + (countBy["completed"] ?? 0)) / Math.max(apps.length, 1) * 100)}%
                </div>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(((countBy["approved"] ?? 0) + (countBy["completed"] ?? 0)) / Math.max(apps.length, 1) * 100)}% Complete
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-2000 ease-out"
                  style={{
                    width: isLoaded ? `${Math.round(((countBy["approved"] ?? 0) + (countBy["completed"] ?? 0)) / Math.max(apps.length, 1) * 100)}%` : '0%',
                    transitionDelay: '1000ms'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Animated Recent Applications Section */}
      <section className={`space-y-6 transform transition-all duration-1000 ease-out ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`} style={{ transitionDelay: '800ms' }}>
        <SectionHeader 
          title="Recent Applications"
          subtitle="Your latest mortgage applications"
          actionText="View All"
          actionHref="/applications"
        />
        
        {apps.length === 0 ? (
          <div className="transform transition-all duration-700 ease-out" style={{ transitionDelay: '1000ms' }}>
            <EmptyState
              title="No applications yet"
              description="Start by creating your first mortgage application."
              actionText="Create Application"
              actionHref="/applications/new"
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {apps.slice(0, 3).map((app, index) => (
              <div
                key={app.id}
                className={`transform transition-all duration-700 ease-out ${
                  isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{
                  transitionDelay: `${1200 + (index * 150)}ms`
                }}
              >
                <ApplicationCard
                  id={app.id}
                  status={app.status}
                  propertyAddress={app.propertyAddress || undefined}
                  createdAt={app.createdAt}
                  documentCount={app.documents.length}
                  href={`/applications/${app.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
