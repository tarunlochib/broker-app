"use client";
import { ReactNode } from "react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    title: string;
    description?: string;
    icon?: ReactNode;
  }[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  steps, 
  onStepClick,
  className = "" 
}: StepNavigationProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Application Progress</h2>
          <p className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Complete</div>
          <div className="text-sm font-semibold text-blue-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </div>
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="mb-5">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Compact Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={stepNumber}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
                ${isCurrent 
                  ? "bg-blue-50 border border-blue-200" 
                  : isCompleted 
                    ? "bg-green-50 border border-green-200 hover:bg-green-100"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                }
                ${onStepClick ? "hover:scale-[1.02]" : ""}
              `}
              onClick={() => onStepClick && onStepClick(stepNumber)}
            >
              {/* Compact Step Number */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 flex-shrink-0
                ${isCurrent 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : isCompleted 
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Compact Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {step.icon && (
                    <div className={`
                      p-1 rounded-md transition-colors duration-200 flex-shrink-0
                      ${isCurrent ? "bg-blue-100 text-blue-600" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}
                    `}>
                      {step.icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className={`
                      text-sm font-medium transition-colors duration-200 truncate
                      ${isCurrent ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-700"}
                    `}>
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className={`
                        text-xs mt-0.5 transition-colors duration-200 truncate
                        ${isCurrent ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"}
                      `}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Status Indicator */}
              {isCurrent && (
                <div className="flex items-center gap-1 text-blue-600 flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Now</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
