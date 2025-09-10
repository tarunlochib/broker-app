"use client";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, icon, children, className = "" }: FormSectionProps) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

interface FormGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function FormGrid({ children, cols = 2, gap = "md" }: FormGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  const gapClass = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6"
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gapClass[gap]}`}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className = "" }: FormActionsProps) {
  return (
    <div className={`flex items-center justify-between gap-4 pt-6 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
