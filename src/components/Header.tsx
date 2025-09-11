"use client";
import { useSession } from "next-auth/react";
import { Logo } from "./navbar/Logo";
import { NavigationMenu } from "./navbar/NavigationMenu";
import { MobileNavigationMenu } from "./navbar/MobileNavigationMenu";
import { UserMenu } from "./navbar/UserMenu";
import { AuthButtons } from "./navbar/AuthButtons";

export default function Header() {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user);
  const role = (session as any)?.user?.role as string | undefined;

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
            {/* Mobile Navigation Menu */}
            <div className="md:hidden">
              <MobileNavigationMenu role={role} />
            </div>
            
            {/* Logo */}
            <Logo />
          </div>
          
          {/* Center - Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu role={role} />
          </div>
          
          {/* Right Side - User Actions */}
          <div className="flex items-center gap-4">
            {!isAuthed ? (
              <AuthButtons />
            ) : (
              <UserMenu />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}


