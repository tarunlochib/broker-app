"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
              {session.user.name || "User"}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[150px]">
              {session.user.email}
            </div>
          </div>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {session.user.name || "User"}
              </div>
              <div className="text-xs text-gray-500">
                {session.user.email}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Role: {(session.user as any).role || "borrower"}
              </div>
            </div>
            
            <div className="py-2">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
