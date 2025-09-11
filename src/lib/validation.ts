export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  private rules: { [key: string]: ValidationRule } = {};

  addRule(field: string, rule: ValidationRule) {
    this.rules[field] = rule;
    return this;
  }

  validate(data: any): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [field, rule] of Object.entries(this.rules)) {
      const value = data[field];
      const error = this.validateField(field, value, rule);
      if (error) {
        errors[field] = error;
      }
    }

    return errors;
  }

  private validateField(field: string, value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${this.getFieldLabel(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `${this.getFieldLabel(field)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `${this.getFieldLabel(field)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${this.getFieldLabel(field)} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      phone: "Phone number",
      propertyAddress: "Property address",
      loanAmount: "Loan amount",
      annualIncome: "Annual income",
      employmentStatus: "Employment status",
      assets: "Assets",
      liabilities: "Liabilities",
      expenses: "Expenses",
    };
    return labels[field] || field;
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  australianPhone: /^(\+61|0)[2-9]\d{8}$/,
  postcode: /^\d{4}$/,
  money: /^\d+(\.\d{2})?$/,
};

// Common validation rules
export const CommonRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: ValidationPatterns.email 
  },
  password: { 
    required: true, 
    minLength: 8,
    custom: (value: string) => {
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
      if (!/\d/.test(value)) return "Password must contain at least one number";
      return null;
    }
  },
  phone: { 
    required: true, 
    pattern: ValidationPatterns.australianPhone 
  },
  money: {
    pattern: ValidationPatterns.money,
    custom: (value: string) => {
      if (!value) return null;
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) return "Amount must be a positive number";
      if (num > 999999999) return "Amount is too large";
      return null;
    }
  },
  address: { 
    required: true, 
    minLength: 10,
    maxLength: 200 
  },
  name: { 
    required: true, 
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/
  },
};

// Helper function to validate JSON fields
export function validateJsonField(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return null;
  
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      return `${fieldName} must be a valid object`;
    }
    return null;
  } catch {
    return `${fieldName} must be valid JSON format`;
  }
}
