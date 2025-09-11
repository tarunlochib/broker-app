"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { FormValidator, CommonRules, ValidationPatterns } from "@/lib/validation";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthForm
          mode="signup"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          message={null}
        />
      </div>
    </div>
  );
}


