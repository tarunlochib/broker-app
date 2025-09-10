"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
  message: string | null;
}

export function MagicLinkForm({ onSubmit, isLoading, message }: MagicLinkFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
  };

  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl">
      <div className="mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Magic Link Sign In</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a secure link to sign in
          </p>
        </div>
      </div>

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
        <FormField
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email address"
          icon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-purple-900 mb-1">How it works</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• We'll send a secure link to your email</li>
                <li>• Click the link to automatically sign in</li>
                <li>• No password required - more secure!</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Magic Link...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Magic Link
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Prefer to use a password?{" "}
          <a 
            href="/signin" 
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Sign in with password
          </a>
        </p>
      </div>
    </div>
  );
}
