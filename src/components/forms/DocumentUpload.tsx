"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface DocumentUploadProps {
  onUpload: (files: File[], category: string) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  required?: boolean;
  examples: string[];
}

export function DocumentUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
  disabled = false,
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, category: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories: DocumentCategory[] = [
    {
      id: "identity",
      name: "Identity Documents",
      description: "Driver's license, passport, birth certificate",
      icon: "🆔",
      required: true,
      examples: ["Driver's License", "Passport", "Birth Certificate", "Medicare Card"]
    },
    {
      id: "income",
      name: "Income Documents",
      description: "Payslips, tax returns, employment contracts",
      icon: "💰",
      required: true,
      examples: ["Recent Payslips", "Tax Returns", "Employment Contract", "Bank Statements"]
    },
    {
      id: "bank",
      name: "Banking Documents",
      description: "Bank statements, account details",
      icon: "🏦",
      required: true,
      examples: ["Bank Statements", "Account Details", "Credit Card Statements"]
    },
    {
      id: "property",
      name: "Property Documents",
      description: "Property reports, contracts, valuations",
      icon: "🏠",
      required: false,
      examples: ["Property Contract", "Building Report", "Valuation Report", "Strata Reports"]
    },
    {
      id: "loan",
      name: "Loan Documents",
      description: "Existing loan statements, refinancing docs",
      icon: "📋",
      required: false,
      examples: ["Loan Statements", "Refinancing Documents", "Credit Reports"]
    },
    {
      id: "other",
      name: "Other Documents",
      description: "Any other relevant documents",
      icon: "📄",
      required: false,
      examples: ["Insurance Documents", "Legal Documents", "Other Supporting Documents"]
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (!selectedCategory) {
      setError("Please select a document category first");
      return;
    }

    setError(null);
    
    // Validate files
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
        return;
      }
      
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        setError(`File ${file.name} has an unsupported format`);
        return;
      }
    }

    try {
      setUploading(true);
      await onUpload(files, selectedCategory);
      
      // Add to uploaded files list
      const newUploads = files.map(file => ({ file, category: selectedCategory }));
      setUploadedFiles(prev => [...prev, ...newUploads]);
      
      // Reset category selection
      setSelectedCategory("");
    } catch (err: unknown) {
      setError((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      identity: "🆔",
      income: "💰",
      bank: "🏦",
      property: "🏠",
      loan: "📋",
      other: "📄"
    };
    return icons[category] || "📄";
  };

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 rounded-lg bg-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
          <p className="text-sm text-gray-500">Select document type and upload your files</p>
        </div>
      </div>

      {/* Compact Category Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Document Type</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {documentCategories.map((category) => (
            <button
              key={category.id}
              className={`
                text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-sm
                ${selectedCategory === category.id 
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => !disabled && setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium text-gray-900 truncate">{category.name}</span>
                {category.required && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{category.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Upload Area */}
      {selectedCategory && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(selectedCategory)}</span>
            <h4 className="font-medium text-gray-900">
              Upload {documentCategories.find(c => c.id === selectedCategory)?.name}
            </h4>
          </div>

          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
              ${isDragOver 
                ? "border-blue-400 bg-blue-50/50" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${error ? "border-red-300 bg-red-50/50" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />

            <div className="space-y-3">
              <div className="text-3xl">
                {isDragOver ? "📁" : "📤"}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isDragOver ? "Drop files here" : "Drag & drop files or click to browse"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {acceptedTypes.join(", ")} • Max {maxSize}MB • Up to {maxFiles} files
                </p>
              </div>

              {!disabled && (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose Files
                </Button>
              )}
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length})</h4>
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((upload, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-800 truncate">{upload.file.name}</span>
                    <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                      {documentCategories.find(c => c.id === upload.category)?.name}
                    </span>
                  </div>
                  <div className="text-xs text-green-600">
                    {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );
}
