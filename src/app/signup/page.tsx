"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string; password: string; confirmPassword?: string; name?: string }) => {
    setError(null);
    
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
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
        throw new Error(errorData?.error || "Failed to create account");
      }
      
      // Auto sign in after successful signup
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (signInRes?.error) {
        setError("Account created but failed to sign in. Please try signing in manually.");
      } else {
        // Redirect based on user role (new users are always borrowers)
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
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


