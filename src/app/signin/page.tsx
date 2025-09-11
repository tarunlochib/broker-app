"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'credentials' | 'magiclink'>('credentials');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add auth-page class to html and body for proper background
    document.documentElement.classList.add('auth-page');
    document.body.classList.add('auth-page');
    return () => {
      document.documentElement.classList.remove('auth-page');
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleCredentialsSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // Wait for session to load and then redirect based on role
        setTimeout(async () => {
          try {
            const sessionResponse = await fetch('/api/auth/session');
            const session = await sessionResponse.json();
            
            if (session?.user?.role === 'broker' || session?.user?.role === 'admin') {
              window.location.href = "/broker";
            } else {
              window.location.href = "/dashboard";
            }
          } catch {
            // Fallback to dashboard if session check fails
            window.location.href = "/dashboard";
          }
        }, 100);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const response = await fetch('/api/auth/signin/email', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setMessage("Check your email for the magic link!");
      } else {
        setError("Failed to send magic link. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Fixed background container */}
      <div className="auth-page-container bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-indigo-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} />
        </div>
      </div>

      {/* Content container */}
      <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-md w-full space-y-8 transform transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className={`transform transition-all duration-700 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            {authMode === 'credentials' ? (
              <AuthForm
                mode="signin"
                onSubmit={handleCredentialsSubmit}
                isLoading={isLoading}
                error={error}
                message={message}
              />
            ) : (
              <MagicLinkForm
                onSubmit={handleMagicLinkSubmit}
                isLoading={isLoading}
                message={message}
              />
            )}
          </div>

          <div className={`text-center transform transition-all duration-700 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            <button
              onClick={() => {
                setAuthMode(authMode === 'credentials' ? 'magiclink' : 'credentials');
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 font-medium"
            >
              {authMode === 'credentials' 
                ? 'Or sign in with magic link' 
                : 'Or sign in with password'
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


