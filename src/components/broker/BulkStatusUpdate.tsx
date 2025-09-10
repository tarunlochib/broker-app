"use client";

import { useState } from "react";

interface BulkStatusUpdateProps {
  selectedApplications: string[];
  onStatusUpdate: (applicationIds: string[], newStatus: string, notes?: string) => Promise<void>;
  onClose: () => void;
}

export function BulkStatusUpdate({ selectedApplications, onStatusUpdate, onClose }: BulkStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'under_review', label: 'Start Review', color: 'blue' },
    { value: 'approved', label: 'Approve', color: 'green' },
    { value: 'rejected', label: 'Reject', color: 'red' },
    { value: 'pending', label: 'Request More Info', color: 'yellow' },
    { value: 'completed', label: 'Mark as Completed', color: 'green' },
  ];

  const handleBulkUpdate = async () => {
    if (!selectedStatus) {
      alert('Please select a status');
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate(selectedApplications, selectedStatus, notes);
      onClose();
    } catch (error) {
      console.error('Error updating applications:', error);
      alert('Failed to update applications');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bulk Status Update
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Update {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select status...</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBulkUpdate}
            disabled={isUpdating || !selectedStatus}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Applications'}
          </button>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
