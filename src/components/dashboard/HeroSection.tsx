"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  userName?: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
}

export function HeroSection({ 
  userName, 
  subtitle = "Track your mortgage applications and upload documents securely.",
  actionText = "New Application",
  actionHref = "/applications/new"
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      {/* Animated background elements */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-2xl animate-pulse" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/3 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
      </div>
      
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className={`space-y-2 transform transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-2xl lg:text-3xl font-medium">
              Welcome{userName ? `, ${userName}` : ""}
            </h1>
            <p className="text-sm lg:text-base opacity-90 max-w-lg leading-relaxed">
              {subtitle}
            </p>
          </div>
          
          <div className={`flex-shrink-0 transform transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`} style={{ transitionDelay: '300ms' }}>
            <Button 
              asChild
              variant="outline"
              size="sm"
              className="!bg-white !text-blue-700 hover:!bg-blue-50 hover:!text-blue-800 !border-blue-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
            >
              <Link href={actionHref}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {actionText}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
