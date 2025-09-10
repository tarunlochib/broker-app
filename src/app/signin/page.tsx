"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'credentials' | 'magiclink'>('credentials');

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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

        <div className="text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'credentials' ? 'magiclink' : 'credentials');
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {authMode === 'credentials' 
              ? 'Or sign in with magic link' 
              : 'Or sign in with password'
            }
          </button>
        </div>
      </div>
    </div>
  );
}


