"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./navbar/Logo";
import { NavigationMenu } from "./navbar/NavigationMenu";
import { MobileNavigationMenu } from "./navbar/MobileNavigationMenu";
import { UserMenu } from "./navbar/UserMenu";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthed = Boolean(session?.user);
  const role = (session as any)?.user?.role as string | undefined;
  
  // Check if we're on auth pages
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  return (
    <header className="sticky top-0 z-50">
      {/* Enhanced accent bar with animation */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
      
      {/* Main header */}
      <div className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 relative">
          {/* Left Side - Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Navigation Menu - Only show if not on auth pages */}
            {!isAuthPage && (
              <div className="md:hidden">
                <MobileNavigationMenu role={role} />
              </div>
            )}
            
            {/* Logo */}
            <Logo />
          </div>
          
          {/* Center - Desktop Navigation - Only show if not on auth pages */}
          {!isAuthPage && (
            <div className="hidden md:block">
              <NavigationMenu role={role} />
            </div>
          )}
          
          {/* Right Side - User Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isAuthed ? (
              // Show appropriate auth buttons based on current page
              <div className="flex items-center gap-2 sm:gap-3">
                {pathname === "/signin" ? (
                  <Link 
                    href="/signup"
                    className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                ) : pathname === "/signup" ? (
                  <Link 
                    href="/signin"
                    className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                ) : (
                  // Default auth buttons for other pages
                  <>
                    <Link 
                      href="/signin"
                      className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/signup"
                      className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <UserMenu />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}


