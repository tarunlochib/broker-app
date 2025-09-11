"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { FormSection, FormGrid, FormActions } from "@/components/forms/FormLayout";
import { StepNavigation } from "@/components/forms/StepNavigation";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { ErrorDisplay, FieldError, LoadingState } from "@/components/ui/ErrorDisplay";
import { FormValidator, CommonRules, ValidationPatterns, validateJsonField } from "@/lib/validation";

type AppData = {
  id: string;
  // personal
  firstName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  phone?: string | null;
  currentAddress?: string | null;
  maritalStatus?: string | null;
  dependents?: number | null;
  // employment
  employmentStatus?: string | null;
  employerName?: string | null;
  occupation?: string | null;
  employmentStartDate?: string | null;
  incomeType?: string | null;
  annualIncome?: number | null;
  abn?: string | null;
  // property & loan
  propertyAddress?: string | null;
  purchasePrice?: number | null;
  loanPurpose?: string | null;
  propertyType?: string | null;
  occupancy?: string | null;
  loanAmount?: number | null;
  deposit?: number | null;
  lvr?: number | null;
  // financials (JSON-ish via textarea)
  assets?: any;
  liabilities?: any;
  expenses?: any;
};

type FormState = {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  currentAddress: string;
  maritalStatus: string;
  dependents: string;
  employmentStatus: string;
  employerName: string;
  occupation: string;
  employmentStartDate: string;
  incomeType: string;
  annualIncome: string;
  abn: string;
  propertyAddress: string;
  purchasePrice: string;
  loanPurpose: string;
  propertyType: string;
  occupancy: string;
  loanAmount: string;
  deposit: string;
  lvr: string;
  assets: string;
  liabilities: string;
  expenses: string;
};

export default function EditApplicationForm({ initial }: { initial: AppData }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, category: string, tempId: string}[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      title: "Personal Information",
      description: "Basic personal details and contact information",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Employment & Income",
      description: "Work details and financial information",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    },
    {
      title: "Property & Loan",
      description: "Property details and loan requirements",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Financial Details",
      description: "Assets, liabilities, and monthly expenses",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Documents",
      description: "Upload supporting documents",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const [form, setForm] = useState<FormState>({
    firstName: initial.firstName ?? "",
    lastName: initial.lastName ?? "",
    dob: initial.dob ? new Date(initial.dob).toISOString().slice(0, 10) : "",
    phone: initial.phone ?? "",
    currentAddress: initial.currentAddress ?? "",
    maritalStatus: initial.maritalStatus ?? "",
    dependents: initial.dependents?.toString() ?? "",
    employmentStatus: initial.employmentStatus ?? "",
    employerName: initial.employerName ?? "",
    occupation: initial.occupation ?? "",
    employmentStartDate: initial.employmentStartDate ? new Date(initial.employmentStartDate).toISOString().slice(0, 10) : "",
    incomeType: initial.incomeType ?? "",
    annualIncome: initial.annualIncome?.toString() ?? "",
    abn: initial.abn ?? "",
    propertyAddress: initial.propertyAddress ?? "",
    purchasePrice: initial.purchasePrice?.toString() ?? "",
    loanPurpose: initial.loanPurpose ?? "",
    propertyType: initial.propertyType ?? "",
    occupancy: initial.occupancy ?? "",
    loanAmount: initial.loanAmount?.toString() ?? "",
    deposit: initial.deposit?.toString() ?? "",
    lvr: initial.lvr?.toString() ?? "",
    assets: initial.assets ? JSON.stringify(initial.assets) : "",
    liabilities: initial.liabilities ? JSON.stringify(initial.liabilities) : "",
    expenses: initial.expenses ? JSON.stringify(initial.expenses) : "",
  });

  const handleDocumentUpload = async (files: File[], category: string) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });
      formData.append('applicationId', initial.id);
      formData.append('category', category);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      setUploadedFiles(prev => [...prev, ...files.map(file => ({ file, category, tempId: Math.random().toString(36).substr(2, 9) }))]);
    } catch (error) {
      throw error;
    }
  };

  // Create validator instance
  const validator = useMemo(() => {
    const v = new FormValidator();
    
    // Personal Information
    v.addRule("firstName", CommonRules.name);
    v.addRule("lastName", CommonRules.name);
    v.addRule("dob", { 
      required: true,
      custom: (value: string) => {
        if (!value) return "Date of birth is required";
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        if (age < 18) return "You must be at least 18 years old";
        if (age > 100) return "Please enter a valid date of birth";
        return null;
      }
    });
    v.addRule("phone", CommonRules.phone);
    v.addRule("currentAddress", CommonRules.address);
    v.addRule("maritalStatus", CommonRules.required);
    
    // Employment & Income
    v.addRule("employmentStatus", CommonRules.required);
    v.addRule("employerName", {
      custom: (value: string) => {
        if (form.employmentStatus === "employed" && (!value || !value.trim())) {
          return "Employer name is required when employed";
        }
        return null;
      }
    });
    v.addRule("occupation", {
      custom: (value: string) => {
        if (form.employmentStatus === "employed" && (!value || !value.trim())) {
          return "Occupation is required when employed";
        }
        return null;
      }
    });
    v.addRule("annualIncome", {
      required: true,
      pattern: ValidationPatterns.money,
      custom: (value: string) => {
        if (!value) return "Annual income is required";
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return "Annual income must be a positive number";
        if (num < 20000) return "Annual income seems too low";
        if (num > 2000000) return "Annual income seems too high";
        return null;
      }
    });
    
    // Property & Loan
    v.addRule("propertyAddress", CommonRules.address);
    v.addRule("purchasePrice", {
      required: true,
      pattern: ValidationPatterns.money,
      custom: (value: string) => {
        if (!value) return "Purchase price is required";
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return "Purchase price must be a positive number";
        if (num < 100000) return "Purchase price seems too low";
        if (num > 50000000) return "Purchase price seems too high";
        return null;
      }
    });
    v.addRule("loanAmount", {
      required: true,
      pattern: ValidationPatterns.money,
      custom: (value: string) => {
        if (!value) return "Loan amount is required";
        const num = parseFloat(value);
        const purchasePrice = parseFloat(form.purchasePrice);
        if (isNaN(num) || num < 0) return "Loan amount must be a positive number";
        if (purchasePrice && num > purchasePrice) return "Loan amount cannot exceed purchase price";
        return null;
      }
    });
    v.addRule("deposit", {
      required: true,
      pattern: ValidationPatterns.money,
      custom: (value: string) => {
        if (!value) return "Deposit amount is required";
        const num = parseFloat(value);
        const purchasePrice = parseFloat(form.purchasePrice);
        if (isNaN(num) || num < 0) return "Deposit must be a positive number";
        if (purchasePrice && num > purchasePrice) return "Deposit cannot exceed purchase price";
        return null;
      }
    });
    v.addRule("loanPurpose", CommonRules.required);
    v.addRule("propertyType", CommonRules.required);
    v.addRule("occupancy", CommonRules.required);
    
    // Financial Details
    v.addRule("assets", {
      custom: (value: string) => validateJsonField(value, "Assets")
    });
    v.addRule("liabilities", {
      custom: (value: string) => validateJsonField(value, "Liabilities")
    });
    v.addRule("expenses", {
      custom: (value: string) => validateJsonField(value, "Expenses")
    });
    
    return v;
  }, [form.employmentStatus, form.purchasePrice]);

  // Validation function
  const validateStep = (stepNumber: number): boolean => {
    const stepFields: { [key: number]: string[] } = {
      1: ["firstName", "lastName", "dob", "phone", "currentAddress", "maritalStatus"],
      2: ["employmentStatus", "employerName", "occupation", "annualIncome"],
      3: ["propertyAddress", "purchasePrice", "loanAmount", "deposit", "loanPurpose", "propertyType", "occupancy"],
      4: ["assets", "liabilities", "expenses"]
    };
    
    const fieldsToValidate = stepFields[stepNumber] || [];
    const errors = validator.validate(form);
    
    // Filter errors for current step
    const stepErrors: Record<string, string> = {};
    fieldsToValidate.forEach(field => {
      if (errors[field]) {
        stepErrors[field] = errors[field];
      }
    });
    
    setValidationErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validation function that doesn't update state (for checking completion)
  const validateStepSilent = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (stepNumber) {
      case 1: // Personal Information
        if (!form.firstName?.trim()) errors.firstName = "First name is required";
        if (!form.lastName?.trim()) errors.lastName = "Last name is required";
        if (!form.dob?.trim()) errors.dob = "Date of birth is required";
        if (!form.phone?.trim()) errors.phone = "Phone number is required";
        if (!form.currentAddress?.trim()) errors.currentAddress = "Current address is required";
        break;
        
      case 2: // Employment & Income
        if (!form.employmentStatus?.trim()) errors.employmentStatus = "Employment status is required";
        if (!form.annualIncome?.trim()) errors.annualIncome = "Annual income is required";
        if (form.employmentStatus === "employed" && !form.employerName?.trim()) {
          errors.employerName = "Employer name is required";
        }
        if (form.employmentStatus === "employed" && !form.occupation?.trim()) {
          errors.occupation = "Occupation is required";
        }
        break;
        
      case 3: // Property & Loan
        if (!form.propertyAddress?.trim()) errors.propertyAddress = "Property address is required";
        if (!form.purchasePrice?.trim()) errors.purchasePrice = "Purchase price is required";
        if (!form.loanAmount?.trim()) errors.loanAmount = "Loan amount is required";
        if (!form.deposit?.trim()) errors.deposit = "Deposit amount is required";
        if (!form.loanPurpose?.trim()) errors.loanPurpose = "Loan purpose is required";
        if (!form.propertyType?.trim()) errors.propertyType = "Property type is required";
        if (!form.occupancy?.trim()) errors.occupancy = "Occupancy type is required";
        break;
        
      case 4: // Financial Details
        // Financial details are optional but if provided, should be valid JSON
        if (form.assets && form.assets.trim()) {
          try {
            JSON.parse(form.assets);
          } catch {
            errors.assets = "Invalid assets data format";
          }
        }
        if (form.liabilities && form.liabilities.trim()) {
          try {
            JSON.parse(form.liabilities);
          } catch {
            errors.liabilities = "Invalid liabilities data format";
          }
        }
        if (form.expenses && form.expenses.trim()) {
          try {
            JSON.parse(form.expenses);
          } catch {
            errors.expenses = "Invalid expenses data format";
          }
        }
        break;
        
      case 5: // Documents
        // Documents are optional for submission but recommended
        break;
    }
    
    return Object.keys(errors).length === 0;
  };

  // Check if all required steps are completed (without updating state)
  const isFormComplete = (): boolean => {
    for (let i = 1; i <= 4; i++) { // Steps 1-4 are required
      if (!validateStepSilent(i)) {
        return false;
      }
    }
    return true;
  };

  // Memoize form completion status to prevent re-renders
  const formComplete = useMemo(() => isFormComplete(), [form]);

  // Helper functions for financial values
  const getFinancialValue = (key: string): string => {
    // Determine which financial section this belongs to
    let sectionKey: keyof FormState;
    if (key.startsWith("assets_")) {
      sectionKey = "assets";
    } else if (key.startsWith("liab_")) {
      sectionKey = "liabilities";
    } else if (key.startsWith("exp_")) {
      sectionKey = "expenses";
    } else {
      return "";
    }

    const financialData = form[sectionKey];
    if (!financialData || financialData.trim() === "") return "";
    
    try {
      const parsed = JSON.parse(financialData);
      return parsed[key.replace(/^(assets_|liab_|exp_)/, "")]?.toString() || "";
    } catch {
      return "";
    }
  };

  const setFinancialValue = (key: string, value: string) => {
    const num = Number(value);
    const finalValue = isFinite(num) && num !== 0 ? num : null;
    
    // Determine which financial section this belongs to
    let sectionKey: keyof FormState;
    if (key.startsWith("assets_")) {
      sectionKey = "assets";
    } else if (key.startsWith("liab_")) {
      sectionKey = "liabilities";
    } else if (key.startsWith("exp_")) {
      sectionKey = "expenses";
    } else {
      return;
    }

    // Parse existing data or start with empty object
    let currentData: Record<string, any> = {};
    if (form[sectionKey] && form[sectionKey].trim() !== "") {
      try {
        currentData = JSON.parse(form[sectionKey]);
      } catch {
        currentData = {};
      }
    }
    
    currentData[key.replace(/^(assets_|liab_|exp_)/, "")] = finalValue;
    
    setForm({
      ...form,
      [sectionKey]: JSON.stringify(currentData)
    });
  };

  async function save() {
    setSaving(true);
    setError(null);
    setValidationErrors({});
    
    try {
      // Validate all required steps before saving
      if (!isFormComplete()) {
        setError("Please complete all required fields before saving the application.");
        setSaving(false);
        return;
      }

      const payload: any = {
        firstName: form.firstName?.trim() || null,
        lastName: form.lastName?.trim() || null,
        dob: form.dob ? new Date(form.dob) : null,
        phone: form.phone?.trim() || null,
        currentAddress: form.currentAddress?.trim() || null,
        maritalStatus: form.maritalStatus?.trim() || null,
        dependents: form.dependents ? Number(form.dependents) : null,
        employmentStatus: form.employmentStatus?.trim() || null,
        employerName: form.employerName?.trim() || null,
        occupation: form.occupation?.trim() || null,
        employmentStartDate: form.employmentStartDate ? new Date(form.employmentStartDate) : null,
        incomeType: form.incomeType?.trim() || null,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
        abn: form.abn?.trim() || null,
        propertyAddress: form.propertyAddress?.trim() || null,
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
        loanPurpose: form.loanPurpose?.trim() || null,
        propertyType: form.propertyType?.trim() || null,
        occupancy: form.occupancy?.trim() || null,
        loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
        deposit: form.deposit ? Number(form.deposit) : null,
        lvr: form.lvr ? Number(form.lvr) : null,
        assets: form.assets && form.assets.trim() ? (() => {
          try { return JSON.parse(form.assets); } catch { return null; }
        })() : null,
        liabilities: form.liabilities && form.liabilities.trim() ? (() => {
          try { return JSON.parse(form.liabilities); } catch { return null; }
        })() : null,
        expenses: form.expenses && form.expenses.trim() ? (() => {
          try { return JSON.parse(form.expenses); } catch { return null; }
        })() : null,
      };
      
      const response = await fetch(`/api/applications/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save application. Please try again.");
      }
      
      router.replace(`/applications/${initial.id}`);
    } catch (e: any) {
      console.error("Application save error:", e);
      
      // Handle different types of errors
      if (e.message?.includes("network") || e.message?.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (e.message?.includes("validation") || e.message?.includes("required")) {
        setError("Please check all required fields and try again.");
      } else if (e.message?.includes("authentication") || e.message?.includes("unauthorized")) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError(e.message || "An unexpected error occurred. Please try again or contact support if the problem persists.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-5 order-1">
            <StepNavigation
              currentStep={step}
              totalSteps={steps.length}
              steps={steps}
              onStepClick={(stepNumber) => setStep(stepNumber)}
            />
          </div>

          {/* Form Content */}
          <div className="lg:col-span-7 order-2 space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <ErrorDisplay
                type="error"
                title="Application Error"
                message={error}
                onDismiss={() => setError(null)}
              />
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <FormSection
                  title="Personal Information"
                  description="Tell us about yourself and your contact details"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                >
                  <FormGrid cols={2}>
                    <FormField
                      label="First Name"
                      value={form.firstName}
                      onChange={(value) => setForm({ ...form, firstName: value })}
                      placeholder="Enter your first name"
                      required
                      error={validationErrors.firstName}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                    />
                    <FormField
                      label="Last Name"
                      value={form.lastName}
                      onChange={(value) => setForm({ ...form, lastName: value })}
                      placeholder="Enter your last name"
                      required
                      error={validationErrors.lastName}
                    />
                    <FormField
                      label="Date of Birth"
                      type="date"
                      value={form.dob}
                      onChange={(value) => setForm({ ...form, dob: value })}
                      required
                      error={validationErrors.dob}
                    />
                    <FormField
                      label="Phone Number"
                      value={form.phone}
                      onChange={(value) => setForm({ ...form, phone: value })}
                      placeholder="04xx xxx xxx"
                      type="tel"
                      required
                      error={validationErrors.phone}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      }
                    />
                    <div className="col-span-2">
                      <FormField
                        label="Current Address"
                        value={form.currentAddress}
                        onChange={(value) => setForm({ ...form, currentAddress: value })}
                        placeholder="Street, suburb, state, postcode"
                        required
                        error={validationErrors.currentAddress}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Marital Status</label>
                        <select
                          value={form.maritalStatus}
                          onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                        >
                          <option value="">Select marital status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                          <option value="de_facto">De facto</option>
                        </select>
                        {validationErrors.maritalStatus && (
                          <p className="text-sm text-red-600">{validationErrors.maritalStatus}</p>
                        )}
                      </div>
                    </div>
                    <FormField
                      label="Number of Dependents"
                      type="number"
                      value={form.dependents}
                      onChange={(value) => setForm({ ...form, dependents: value })}
                      placeholder="0"
                      helpText="Include children and other dependents"
                      error={validationErrors.dependents}
                    />
                  </FormGrid>
                  
                  <FormActions>
                    <div className="flex items-center justify-end">
                      <Button
                        onClick={() => {
                          if (validateStep(1)) {
                            setStep(2);
                          }
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Next Step <span className="ml-1">→</span>
                      </Button>
                    </div>
                  </FormActions>
                </FormSection>
              )}

              {/* Step 2: Employment & Income */}
              {step === 2 && (
                <FormSection
                  title="Employment & Income"
                  description="Tell us about your work and financial situation"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  }
                >
                  <FormGrid cols={2}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Employment Status *</label>
                      <select
                        value={form.employmentStatus}
                        onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                      >
                        <option value="">Select employment status</option>
                        <option value="employed">Employed</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="contractor">Contractor</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="retired">Retired</option>
                      </select>
                      {validationErrors.employmentStatus && (
                        <p className="text-sm text-red-600">{validationErrors.employmentStatus}</p>
                      )}
                    </div>
                    <FormField
                      label="Annual Income"
                      type="number"
                      value={form.annualIncome}
                      onChange={(value) => setForm({ ...form, annualIncome: value })}
                      placeholder="0"
                      currency
                      required
                      error={validationErrors.annualIncome}
                    />
                    {form.employmentStatus === "employed" && (
                      <>
                        <FormField
                          label="Employer Name"
                          value={form.employerName}
                          onChange={(value) => setForm({ ...form, employerName: value })}
                          placeholder="Enter your employer name"
                          required
                          error={validationErrors.employerName}
                        />
                        <FormField
                          label="Occupation"
                          value={form.occupation}
                          onChange={(value) => setForm({ ...form, occupation: value })}
                          placeholder="Enter your occupation"
                          required
                          error={validationErrors.occupation}
                        />
                        <FormField
                          label="Employment Start Date"
                          type="date"
                          value={form.employmentStartDate}
                          onChange={(value) => setForm({ ...form, employmentStartDate: value })}
                        />
                      </>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Income Type</label>
                      <select
                        value={form.incomeType}
                        onChange={(e) => setForm({ ...form, incomeType: e.target.value })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                      >
                        <option value="">Select income type</option>
                        <option value="salary">Salary</option>
                        <option value="hourly">Hourly</option>
                        <option value="commission">Commission</option>
                        <option value="bonus">Bonus</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <FormField
                      label="ABN (if applicable)"
                      value={form.abn}
                      onChange={(value) => setForm({ ...form, abn: value })}
                      placeholder="Enter your ABN"
                    />
                  </FormGrid>
                  
                  <FormActions>
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    <Button 
                      onClick={() => {
                        if (validateStep(2)) {
                          setStep(3);
                        }
                      }} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Next Step
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </FormActions>
                </FormSection>
              )}

              {step === 3 && (
                <FormSection
                  title="Property & Loan"
                  description="Tell us about the property and loan you're seeking"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                >
                  <FormGrid cols={2}>
                    <FormField
                      label="Property Address"
                      value={form.propertyAddress}
                      onChange={(value) => setForm({ ...form, propertyAddress: value })}
                      placeholder="Enter the property address"
                      required
                      error={validationErrors.propertyAddress}
                    />
                    <FormField
                      label="Purchase Price"
                      type="number"
                      value={form.purchasePrice}
                      onChange={(value) => setForm({ ...form, purchasePrice: value })}
                      placeholder="0"
                      currency
                      required
                      error={validationErrors.purchasePrice}
                    />
                    <FormField
                      label="Loan Amount"
                      type="number"
                      value={form.loanAmount}
                      onChange={(value) => setForm({ ...form, loanAmount: value })}
                      placeholder="0"
                      currency
                      required
                      error={validationErrors.loanAmount}
                    />
                    <FormField
                      label="Deposit Amount"
                      type="number"
                      value={form.deposit}
                      onChange={(value) => setForm({ ...form, deposit: value })}
                      placeholder="0"
                      currency
                      required
                      error={validationErrors.deposit}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Loan Purpose *</label>
                      <select
                        value={form.loanPurpose}
                        onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                      >
                        <option value="">Select loan purpose</option>
                        <option value="purchase">Purchase</option>
                        <option value="refinance">Refinance</option>
                        <option value="construction">Construction</option>
                        <option value="investment">Investment</option>
                      </select>
                      {validationErrors.loanPurpose && (
                        <p className="text-sm text-red-600">{validationErrors.loanPurpose}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Property Type *</label>
                      <select
                        value={form.propertyType}
                        onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                      >
                        <option value="">Select property type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                      {validationErrors.propertyType && (
                        <p className="text-sm text-red-600">{validationErrors.propertyType}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Occupancy Type *</label>
                      <select
                        value={form.occupancy}
                        onChange={(e) => setForm({ ...form, occupancy: e.target.value })}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm"
                      >
                        <option value="">Select occupancy type</option>
                        <option value="owner_occupied">Owner Occupied</option>
                        <option value="investment">Investment</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                      {validationErrors.occupancy && (
                        <p className="text-sm text-red-600">{validationErrors.occupancy}</p>
                      )}
                    </div>
                    <FormField
                      label="LVR (%)"
                      type="number"
                      value={form.lvr}
                      onChange={(value) => setForm({ ...form, lvr: value })}
                      placeholder="0"
                      helpText="Loan to Value Ratio"
                    />
                  </FormGrid>
                  
                  <FormActions>
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    <Button 
                      onClick={() => {
                        if (validateStep(3)) {
                          setStep(4);
                        }
                      }} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Next Step
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </FormActions>
                </FormSection>
              )}

              {step === 4 && (
                <FormSection
                  title="Financial Details"
                  description="Tell us about your assets, liabilities, and monthly expenses"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  }
                >
                  <div className="space-y-8">
                    {/* Assets */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
                      <FormGrid cols={2}>
                        <FormField
                          label="Savings"
                          type="number"
                          value={getFinancialValue("assets_savings")}
                          onChange={(value) => setFinancialValue("assets_savings", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Other Property"
                          type="number"
                          value={getFinancialValue("assets_otherProperty")}
                          onChange={(value) => setFinancialValue("assets_otherProperty", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Shares"
                          type="number"
                          value={getFinancialValue("assets_shares")}
                          onChange={(value) => setFinancialValue("assets_shares", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Superannuation"
                          type="number"
                          value={getFinancialValue("assets_super")}
                          onChange={(value) => setFinancialValue("assets_super", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Other Assets"
                          type="number"
                          value={getFinancialValue("assets_other")}
                          onChange={(value) => setFinancialValue("assets_other", value)}
                          placeholder="0"
                          currency
                        />
                      </FormGrid>
                    </div>

                    {/* Liabilities */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Liabilities</h3>
                      <FormGrid cols={2}>
                        <FormField
                          label="Credit Cards"
                          type="number"
                          value={getFinancialValue("liab_creditCards")}
                          onChange={(value) => setFinancialValue("liab_creditCards", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Personal Loans"
                          type="number"
                          value={getFinancialValue("liab_personalLoans")}
                          onChange={(value) => setFinancialValue("liab_personalLoans", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Car Loans"
                          type="number"
                          value={getFinancialValue("liab_carLoans")}
                          onChange={(value) => setFinancialValue("liab_carLoans", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Other Debts"
                          type="number"
                          value={getFinancialValue("liab_other")}
                          onChange={(value) => setFinancialValue("liab_other", value)}
                          placeholder="0"
                          currency
                        />
                      </FormGrid>
                    </div>

                    {/* Monthly Expenses */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
                      <FormGrid cols={2}>
                        <FormField
                          label="Rent/Mortgage"
                          type="number"
                          value={getFinancialValue("exp_rent")}
                          onChange={(value) => setFinancialValue("exp_rent", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Utilities"
                          type="number"
                          value={getFinancialValue("exp_utilities")}
                          onChange={(value) => setFinancialValue("exp_utilities", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Insurance"
                          type="number"
                          value={getFinancialValue("exp_insurance")}
                          onChange={(value) => setFinancialValue("exp_insurance", value)}
                          placeholder="0"
                          currency
                        />
                        <FormField
                          label="Other Expenses"
                          type="number"
                          value={getFinancialValue("exp_other")}
                          onChange={(value) => setFinancialValue("exp_other", value)}
                          placeholder="0"
                          currency
                        />
                      </FormGrid>
                    </div>
        </div>
                  
                  <FormActions>
                    <Button variant="outline" onClick={() => setStep(3)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    <Button 
                      onClick={() => {
                        if (validateStep(4)) {
                          setStep(5);
                        }
                      }} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Next Step
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </FormActions>
                </FormSection>
              )}

              {step === 5 && (
                <FormSection
                  title="Documents"
                  description="Upload supporting documents for your application"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  <DocumentUpload onUpload={handleDocumentUpload} />
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={file.tempId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                                <p className="text-xs text-gray-500">{file.category} • {(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                          </div>
                        ))}
      </div>
    </div>
                  )}
                  
                  <FormActions>
                    <Button variant="outline" onClick={() => setStep(4)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    
                    <div className="flex gap-3 ml-auto">
                      <Button 
                        type="button"
                        onClick={save} 
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Save Draft
                          </>
                        )}
                      </Button>
                      
                      {/* Submit button for draft applications */}
                      <Button 
                        type="button"
                        onClick={async () => {
                          setSaving(true);
                          setError(null);
                          setValidationErrors({});
                          
                          try {
                            // Validate all required steps before submitting
                            if (!isFormComplete()) {
                              setError("Please complete all required fields before submitting the application.");
                              setSaving(false);
                              return;
                            }

                            // First save the current data
                            const payload: any = {
                              firstName: form.firstName?.trim() || null,
                              lastName: form.lastName?.trim() || null,
                              dob: form.dob ? new Date(form.dob) : null,
                              phone: form.phone?.trim() || null,
                              currentAddress: form.currentAddress?.trim() || null,
                              maritalStatus: form.maritalStatus?.trim() || null,
                              dependents: form.dependents ? Number(form.dependents) : null,
                              employmentStatus: form.employmentStatus?.trim() || null,
                              employerName: form.employerName?.trim() || null,
                              occupation: form.occupation?.trim() || null,
                              employmentStartDate: form.employmentStartDate ? new Date(form.employmentStartDate) : null,
                              incomeType: form.incomeType?.trim() || null,
                              annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
                              abn: form.abn?.trim() || null,
                              propertyAddress: form.propertyAddress?.trim() || null,
                              purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
                              loanPurpose: form.loanPurpose?.trim() || null,
                              propertyType: form.propertyType?.trim() || null,
                              occupancy: form.occupancy?.trim() || null,
                              loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
                              deposit: form.deposit ? Number(form.deposit) : null,
                              lvr: form.lvr ? Number(form.lvr) : null,
                              assets: form.assets && form.assets.trim() ? (() => {
                                try { return JSON.parse(form.assets); } catch { return null; }
                              })() : null,
                              liabilities: form.liabilities && form.liabilities.trim() ? (() => {
                                try { return JSON.parse(form.liabilities); } catch { return null; }
                              })() : null,
                              expenses: form.expenses && form.expenses.trim() ? (() => {
                                try { return JSON.parse(form.expenses); } catch { return null; }
                              })() : null,
                              status: "submitted" // Set status to submitted
                            };
                            
                            const response = await fetch(`/api/applications/${initial.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(payload),
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({}));
                              throw new Error(errorData.error || "Failed to submit application. Please try again.");
                            }
                            
                            router.replace(`/applications/${initial.id}`);
                          } catch (e: any) {
                            console.error("Application submission error:", e);
                            
                            // Handle different types of errors
                            if (e.message?.includes("network") || e.message?.includes("fetch")) {
                              setError("Network error. Please check your internet connection and try again.");
                            } else if (e.message?.includes("validation") || e.message?.includes("required")) {
                              setError("Please check all required fields and try again.");
                            } else if (e.message?.includes("authentication") || e.message?.includes("unauthorized")) {
                              setError("Your session has expired. Please sign in again.");
                            } else {
                              setError(e.message || "An unexpected error occurred. Please try again or contact support if the problem persists.");
                            }
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving || !formComplete}
                        className={`px-8 py-2 ${
                          formComplete 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </FormActions>
                </FormSection>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

