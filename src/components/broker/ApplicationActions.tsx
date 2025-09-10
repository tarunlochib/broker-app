"use client";

import { useState } from "react";
import Link from "next/link";

interface ApplicationActionsProps {
  application: any;
}

export function ApplicationActions({ application }: ApplicationActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>('');

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: `Status changed to ${newStatus} by broker`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const updatedApplication = await response.json();
      
      // Show success message
      alert(`Application status updated to ${newStatus} successfully!`);
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update application status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus);
    setShowConfirmDialog(true);
  };

  const confirmStatusUpdate = () => {
    handleStatusUpdate(pendingStatus);
  };

  const getAvailableActions = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return [
          { label: 'Start Review', status: 'under_review', color: 'blue', description: 'Begin reviewing this application' },
          { label: 'Approve', status: 'approved', color: 'green', description: 'Approve this application' },
          { label: 'Reject', status: 'rejected', color: 'red', description: 'Reject this application' },
        ];
      case 'under_review':
        return [
          { label: 'Approve', status: 'approved', color: 'green', description: 'Approve this application' },
          { label: 'Reject', status: 'rejected', color: 'red', description: 'Reject this application' },
          { label: 'Back to Pending', status: 'pending', color: 'yellow', description: 'Return to pending status' },
          { label: 'Request More Info', status: 'pending', color: 'orange', description: 'Request additional information' },
        ];
      case 'approved':
        return [
          { label: 'Reopen for Review', status: 'under_review', color: 'blue', description: 'Reopen for further review' },
          { label: 'Mark as Completed', status: 'completed', color: 'green', description: 'Mark application as completed' },
        ];
      case 'rejected':
        return [
          { label: 'Reopen for Review', status: 'under_review', color: 'blue', description: 'Reopen for further review' },
          { label: 'Appeal Approved', status: 'approved', color: 'green', description: 'Approve after appeal' },
        ];
      case 'completed':
        return [
          { label: 'Reopen for Review', status: 'under_review', color: 'blue', description: 'Reopen for further review' },
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions(application.status);

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={`/applications/${application.id}`}
        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </Link>

      <Link
        href={`/applications/${application.id}/edit`}
        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </Link>

      {availableActions.length > 0 && (
        <div className="relative">
          <select
            disabled={isUpdating}
            onChange={(e) => {
              if (e.target.value) {
                handleStatusChange(e.target.value);
                e.target.value = ''; // Reset selection
              }
            }}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Actions</option>
            {availableActions.map((action) => (
              <option key={action.status} value={action.status}>
                {action.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the application status to{' '}
              <span className="font-semibold text-blue-600">
                {availableActions.find(action => action.status === pendingStatus)?.label}
              </span>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmStatusUpdate}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
