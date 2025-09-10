"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export function AuthForm({ mode, onSubmit, isLoading, error, message }: AuthFormProps) {
  const [form, setForm] = useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && form.password !== form.confirmPassword) {
      return;
    }
    
    await onSubmit(form);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl">
      <div className="mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to your account to continue' 
              : 'Get started with your mortgage application journey'
            }
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-700 font-medium">{message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <FormField
            label="Full Name"
            value={form.name || ""}
            onChange={(value) => handleChange('name', value)}
            placeholder="Enter your full name"
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        )}

        <FormField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(value) => handleChange('email', value)}
          placeholder="Enter your email address"
          icon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(value) => handleChange('password', value)}
            placeholder="Enter your password"
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {mode === 'signup' && (
          <div className="relative">
            <FormField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword || ""}
              onChange={(value) => handleChange('confirmPassword', value)}
              placeholder="Confirm your password"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Mix of letters, numbers, and symbols recommended</li>
              <li>• Must match confirmation password</li>
            </ul>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode === 'signin' ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
              </svg>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <a 
            href={mode === 'signin' ? '/signup' : '/signin'} 
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
}
