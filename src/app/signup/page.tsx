"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { FormValidator, CommonRules, ValidationPatterns } from "@/lib/validation";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (data: { email: string; password: string; confirmPassword?: string; name?: string }) => {
    setError(null);
    
    // Validate input data
    const validator = new FormValidator();
    validator
      .addRule("email", CommonRules.email)
      .addRule("password", CommonRules.password)
      .addRule("name", CommonRules.name);
    
    const validationErrors = validator.validate(data);
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    
    // If there are validation errors, show the first one
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      setError(firstError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: data.email, 
          password: data.password, 
          name: data.name 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Handle specific error cases
        if (res.status === 409) {
          throw new Error("An account with this email already exists. Please try signing in instead.");
        } else if (res.status === 400) {
          throw new Error(errorData?.error || "Please check your information and try again.");
        } else if (res.status >= 500) {
          throw new Error("Server error. Please try again later or contact support.");
        } else {
          throw new Error(errorData?.error || "Failed to create account. Please try again.");
        }
      }
      
      // Auto sign in after successful signup
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (signInRes?.error) {
        setError("Account created successfully! Please sign in to continue.");
      } else {
        // Redirect based on user role (new users are always borrowers)
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      
      const errorMessage = (err as Error).message;
      
      // Handle different types of errors
      if (errorMessage?.includes("network") || errorMessage?.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (errorMessage?.includes("already exists")) {
        setError(errorMessage);
      } else if (errorMessage?.includes("validation") || errorMessage?.includes("required")) {
        setError("Please check all required fields and try again.");
      } else {
        setError(errorMessage || "An unexpected error occurred. Please try again or contact support if the problem persists.");
      }
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
        <div className={`max-w-md w-full transform transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <AuthForm
            mode="signup"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            message={null}
          />
        </div>
      </div>
    </>
  );
}


