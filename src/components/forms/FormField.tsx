"use client";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useState } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  helpText?: string;
  currency?: boolean;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  className = "",
  icon,
  error,
  helpText,
  currency = false,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (type === "number") {
      // For number inputs, allow only numbers, decimal point, and minus sign
      if (currency) {
        // For currency, remove all non-numeric characters except decimal point
        newValue = newValue.replace(/[^0-9.]/g, "");
      } else {
        // For regular numbers, allow numbers, decimal point, and minus
        newValue = newValue.replace(/[^0-9.-]/g, "");
      }
    }
    
    onChange(newValue);
  };

  const displayValue = value; // Always show raw value for better typing experience

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className={`text-xs sm:text-sm font-semibold ${error ? "text-red-600" : "text-gray-700"}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
            {icon}
          </div>
        )}
        
        <Input
          type={type}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            ${icon ? "pl-10" : ""}
            ${currency ? "pr-12 text-right" : ""}
            ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
            ${focused ? "ring-2 ring-blue-500/20 border-blue-400" : ""}
            transition-all duration-200 hover:border-gray-400
          `}
        />
        
        {currency && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
            AUD
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="text-xs text-gray-500">{helpText}</div>
      )}
    </div>
  );
}
