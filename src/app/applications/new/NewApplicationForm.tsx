"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { FormSection, FormGrid, FormActions } from "@/components/forms/FormLayout";
import { StepNavigation } from "@/components/forms/StepNavigation";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { ErrorDisplay, FieldError, LoadingState } from "@/components/ui/ErrorDisplay";
import { FormValidator, CommonRules, ValidationPatterns, validateJsonField } from "@/lib/validation";

type FormState = {
  // personal
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  currentAddress: string;
  maritalStatus: string;
  dependents: string;
  // employment
  employmentStatus: string;
  employerName: string;
  occupation: string;
  employmentStartDate: string;
  incomeType: string;
  annualIncome: string;
  abn: string;
  // property & loan
  propertyAddress: string;
  purchasePrice: string;
  loanPurpose: string;
  propertyType: string;
  occupancy: string;
  loanAmount: string;
  deposit: string;
  lvr: string;
  // financials
  assets: string;
  liabilities: string;
  expenses: string;
};

export default function NewApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
      description: "Upload required documents and files",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    currentAddress: "",
    maritalStatus: "",
    dependents: "",
    employmentStatus: "",
    employerName: "",
    occupation: "",
    employmentStartDate: "",
    incomeType: "",
    annualIncome: "",
    abn: "",
    propertyAddress: "",
    purchasePrice: "",
    loanPurpose: "",
    propertyType: "",
    occupancy: "",
    loanAmount: "",
    deposit: "",
    lvr: "",
    assets: "",
    liabilities: "",
    expenses: "",
  });

  const handleDocumentUpload = async (files: File[], category: string) => {
    try {
      // For new applications, we'll store files temporarily and associate them after creation
      const tempUploads = files.map(file => ({
        file,
        category,
        tempId: Math.random().toString(36).substr(2, 9)
      }));
      
      setUploadedFiles(prev => [...prev, ...tempUploads]);
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

  async function submit() {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    
    try {
      // Validate all required steps before submission
      if (!isFormComplete()) {
        setError("Please complete all required fields before submitting the application.");
        setLoading(false);
        return;
      }

      // Create application
      const res = await fetch("/api/applications", { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create application. Please try again.");
      }
      const created = await res.json();
      // update details
      const payload: any = {
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        dob: form.dob ? new Date(form.dob) : null,
        phone: form.phone || null,
        currentAddress: form.currentAddress || null,
        maritalStatus: form.maritalStatus || null,
        dependents: form.dependents ? Number(form.dependents) : null,
        employmentStatus: form.employmentStatus || null,
        employerName: form.employerName || null,
        occupation: form.occupation || null,
        employmentStartDate: form.employmentStartDate ? new Date(form.employmentStartDate) : null,
        incomeType: form.incomeType || null,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
        abn: form.abn || null,
        propertyAddress: form.propertyAddress || null,
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
        loanPurpose: form.loanPurpose || null,
        propertyType: form.propertyType || null,
        occupancy: form.occupancy || null,
        loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
        deposit: form.deposit ? Number(form.deposit) : null,
        lvr: form.lvr ? Number(form.lvr) : null,
        // Use structured financials from form state with error handling
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
      const upd = await fetch(`/api/applications/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!upd.ok) throw new Error("Failed to save details");
      
      // Upload documents after application is created
      if (uploadedFiles.length > 0) {
        for (const upload of uploadedFiles) {
          const formData = new FormData();
          formData.append('file', upload.file);
          formData.append('applicationId', created.id);
          formData.append('category', upload.category);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            console.error('Failed to upload document:', upload.file.name);
          }
        }
      }
      
      router.replace(`/applications/${created.id}`);
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
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-5">
            <StepNavigation
              currentStep={step}
              totalSteps={steps.length}
              steps={steps}
              onStepClick={(stepNumber) => setStep(stepNumber)}
            />
      </div>

          {/* Form Content */}
          <div className="lg:col-span-7 space-y-6">
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
                    value={form.dob}
                    onChange={(value) => setForm({ ...form, dob: value })}
                    type="date"
                    required
                  />
                  <FormField
                    label="Phone Number"
                    value={form.phone}
                    onChange={(value) => setForm({ ...form, phone: value })}
                    type="tel"
                    placeholder="04xx xxx xxx"
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                  />
                  <FormField
                    label="Current Address"
                    value={form.currentAddress}
                    onChange={(value) => setForm({ ...form, currentAddress: value })}
                    placeholder="Street, suburb, state, postcode"
                    className="sm:col-span-2"
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                  <FormField
                    label="Marital Status"
                    value={form.maritalStatus}
                    onChange={(value) => setForm({ ...form, maritalStatus: value })}
                    placeholder="Single, Married, De facto, etc."
                  />
                  <FormField
                    label="Number of Dependents"
                    value={form.dependents}
                    onChange={(value) => setForm({ ...form, dependents: value })}
                    type="number"
                    placeholder="0"
                    helpText="Include children and other dependents"
                  />
                </FormGrid>
                
                <FormActions>
                  <div></div>
                  <Button onClick={() => setStep(2)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Next Step
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
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
                  <FormField
                    label="Employment Status"
                    value={form.employmentStatus}
                    onChange={(value) => setForm({ ...form, employmentStatus: value })}
                    placeholder="PAYG, Self-employed, Contractor, etc."
                    required
                  />
                  <FormField
                    label="Employer Name"
                    value={form.employerName}
                    onChange={(value) => setForm({ ...form, employerName: value })}
                    placeholder="Company name"
                    required
                  />
                  <FormField
                    label="Occupation"
                    value={form.occupation}
                    onChange={(value) => setForm({ ...form, occupation: value })}
                    placeholder="Your job title"
                    required
                  />
                  <FormField
                    label="Employment Start Date"
                    value={form.employmentStartDate}
                    onChange={(value) => setForm({ ...form, employmentStartDate: value })}
                    type="date"
                    required
                  />
                  <FormField
                    label="Income Type"
                    value={form.incomeType}
                    onChange={(value) => setForm({ ...form, incomeType: value })}
                    placeholder="Base salary, Base + bonus, etc."
                  />
                  <FormField
                    label="Annual Income"
                    value={form.annualIncome}
                    onChange={(value) => setForm({ ...form, annualIncome: value })}
                    type="number"
                    currency
                    placeholder="0"
                    required
                    helpText="Before tax annual income"
                  />
                  <FormField
                    label="ABN (if self-employed)"
                    value={form.abn}
                    onChange={(value) => setForm({ ...form, abn: value })}
                    placeholder="11-digit ABN"
                    className="sm:col-span-2"
                    helpText="Required for self-employed applicants"
                  />
                </FormGrid>
                
                <FormActions>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Next Step
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </FormActions>
              </FormSection>
      )}

      {/* Step 3: Property & Loan */}
      {step === 3 && (
              <FormSection
                title="Property & Loan Details"
                description="Tell us about the property and loan you're applying for"
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
                    placeholder="Street, suburb, state, postcode"
                    className="sm:col-span-2"
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                  <FormField
                    label="Purchase Price"
                    value={form.purchasePrice}
                    onChange={(value) => setForm({ ...form, purchasePrice: value })}
                    type="number"
                    currency
                    placeholder="0"
                    required
                  />
                  <FormField
                    label="Loan Purpose"
                    value={form.loanPurpose}
                    onChange={(value) => setForm({ ...form, loanPurpose: value })}
                    placeholder="Purchase, Refinance, Investment"
                    required
                  />
                  <FormField
                    label="Property Type"
                    value={form.propertyType}
                    onChange={(value) => setForm({ ...form, propertyType: value })}
                    placeholder="House, Unit, Townhouse, Land"
                    required
                  />
                  <FormField
                    label="Occupancy"
                    value={form.occupancy}
                    onChange={(value) => setForm({ ...form, occupancy: value })}
                    placeholder="Owner occupied, Investment"
                    required
                  />
                  <FormField
                    label="Loan Amount"
                    value={form.loanAmount}
                    onChange={(value) => setForm({ ...form, loanAmount: value })}
                    type="number"
                    currency
                    placeholder="0"
                    required
                  />
                  <FormField
                    label="Deposit Amount"
                    value={form.deposit}
                    onChange={(value) => setForm({ ...form, deposit: value })}
                    type="number"
                    currency
                    placeholder="0"
                    required
                  />
                  <FormField
                    label="LVR (%)"
                    value={form.lvr}
                    onChange={(value) => setForm({ ...form, lvr: value })}
                    type="number"
                    placeholder="0"
                    helpText="Loan-to-Value Ratio percentage"
                  />
                </FormGrid>
                
                {error && (
                  <ErrorDisplay
                    type="error"
                    title="Application Error"
                    message={error}
                    onDismiss={() => setError(null)}
                  />
                )}
                
                <FormActions>
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <Button onClick={() => setStep(4)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Next Step
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </FormActions>
              </FormSection>
            )}

            {/* Step 4: Financial Details */}
      {step === 4 && (
              <FormSection
                title="Financial Details"
                description="Provide information about your assets, liabilities, and expenses"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                }
              >
                <div className="space-y-8">
                  {/* Assets */}
            <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-green-600">💰</span>
                      Assets
                    </h3>
                    <FormGrid cols={2}>
                      <FormField
                        label="Savings Amount"
                        value={getFinancialValue("assets_savings")}
                        onChange={(value) => setFinancialValue("assets_savings", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Other Property Value"
                        value={getFinancialValue("assets_otherProperty")}
                        onChange={(value) => setFinancialValue("assets_otherProperty", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Shares Value"
                        value={getFinancialValue("assets_shares")}
                        onChange={(value) => setFinancialValue("assets_shares", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Superannuation Value"
                        value={getFinancialValue("assets_super")}
                        onChange={(value) => setFinancialValue("assets_super", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Other Assets"
                        value={getFinancialValue("assets_other")}
                        onChange={(value) => setFinancialValue("assets_other", value)}
                        type="number"
                        currency
                        placeholder="0"
                        className="sm:col-span-2"
                      />
                    </FormGrid>
            </div>

                  {/* Liabilities */}
            <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-red-600">📉</span>
                      Liabilities
                    </h3>
                    <FormGrid cols={2}>
                      <FormField
                        label="Credit Cards - Total Limit"
                        value={getFinancialValue("liab_cardsLimit")}
                        onChange={(value) => setFinancialValue("liab_cardsLimit", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Credit Cards - Total Balance"
                        value={getFinancialValue("liab_cardsBalance")}
                        onChange={(value) => setFinancialValue("liab_cardsBalance", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Personal Loans Balance"
                        value={getFinancialValue("liab_personal")}
                        onChange={(value) => setFinancialValue("liab_personal", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Auto Loans Balance"
                        value={getFinancialValue("liab_auto")}
                        onChange={(value) => setFinancialValue("liab_auto", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="HECS/HELP Balance"
                        value={getFinancialValue("liab_hecs")}
                        onChange={(value) => setFinancialValue("liab_hecs", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Other Liabilities"
                        value={getFinancialValue("liab_other")}
                        onChange={(value) => setFinancialValue("liab_other", value)}
                        type="number"
                        currency
                        placeholder="0"
                        className="sm:col-span-2"
                      />
                    </FormGrid>
            </div>

                  {/* Monthly Expenses */}
            <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">💸</span>
                      Monthly Expenses
                    </h3>
                    <FormGrid cols={2}>
                      <FormField
                        label="Living Expenses"
                        value={getFinancialValue("exp_living")}
                        onChange={(value) => setFinancialValue("exp_living", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Rent"
                        value={getFinancialValue("exp_rent")}
                        onChange={(value) => setFinancialValue("exp_rent", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Childcare"
                        value={getFinancialValue("exp_childcare")}
                        onChange={(value) => setFinancialValue("exp_childcare", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Insurance"
                        value={getFinancialValue("exp_insurance")}
                        onChange={(value) => setFinancialValue("exp_insurance", value)}
                        type="number"
                        currency
                        placeholder="0"
                      />
                      <FormField
                        label="Other Expenses"
                        value={getFinancialValue("exp_other")}
                        onChange={(value) => setFinancialValue("exp_other", value)}
                        type="number"
                        currency
                        placeholder="0"
                        className="sm:col-span-2"
                      />
                    </FormGrid>
            </div>
            </div>

                {error && (
                  <ErrorDisplay
                    type="error"
                    title="Application Error"
                    message={error}
                    onDismiss={() => setError(null)}
                  />
                )}
                
                <FormActions>
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <Button onClick={() => setStep(5)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Next Step
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </FormActions>
              </FormSection>
            )}

            {/* Step 5: Documents */}
            {step === 5 && (
              <FormSection
                title="Document Upload"
                description="Upload required documents to complete your application"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                <div className="space-y-6">
                  <DocumentUpload
                    onUpload={handleDocumentUpload}
                    maxFiles={10}
                    maxSize={10}
                    acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                  />
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Uploaded Files</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">{file.file.name}</span>
                            <span className="text-xs text-green-600 ml-auto">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
            </div>
                        ))}
            </div>
            </div>
                  )}
            </div>

                {error && (
                  <ErrorDisplay
                    type="error"
                    title="Application Error"
                    message={error}
                    onDismiss={() => setError(null)}
                  />
                )}
                
                <FormActions>
                  <Button variant="outline" onClick={() => setStep(4)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  
                  <div className="flex gap-3 ml-auto">
                    {/* Save Progress Button */}
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          // Save as draft without validation
                          const res = await fetch("/api/applications", { method: "POST" });
                          if (!res.ok) throw new Error("Failed to save draft");
                          const created = await res.json();
                          
                          const payload: any = {
                            firstName: form.firstName || null,
                            lastName: form.lastName || null,
                            dob: form.dob ? new Date(form.dob) : null,
                            phone: form.phone || null,
                            currentAddress: form.currentAddress || null,
                            maritalStatus: form.maritalStatus || null,
                            dependents: form.dependents ? Number(form.dependents) : null,
                            employmentStatus: form.employmentStatus || null,
                            employerName: form.employerName || null,
                            occupation: form.occupation || null,
                            employmentStartDate: form.employmentStartDate ? new Date(form.employmentStartDate) : null,
                            incomeType: form.incomeType || null,
                            annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
                            abn: form.abn || null,
                            propertyAddress: form.propertyAddress || null,
                            purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
                            loanPurpose: form.loanPurpose || null,
                            propertyType: form.propertyType || null,
                            occupancy: form.occupancy || null,
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
                            status: "draft"
                          };
                          
                          const upd = await fetch(`/api/applications/${created.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          });
                          
                          if (!upd.ok) throw new Error("Failed to save draft");
                          
                          // Show success message
                          setError(null);
                          alert("Progress saved successfully!");
                        } catch (e: any) {
                          setError(e.message || "Failed to save progress");
                        }
                      }}
                      className="px-4 py-2 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Save Progress
                    </Button>

                    <Button 
                      disabled={loading || !formComplete} 
                      onClick={submit} 
                      className={`px-8 py-2 ${
                        formComplete 
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Application...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Create Application
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
