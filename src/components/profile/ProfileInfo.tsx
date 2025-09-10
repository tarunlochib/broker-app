"use client";

import { Card } from "@/components/ui/Card";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleDisplay = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'broker':
        return 'Broker';
      case 'borrower':
        return 'Borrower';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'broker':
        return 'bg-blue-100 text-blue-800';
      case 'borrower':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Information</h2>
        <p className="text-sm text-gray-600">Your account details and membership information</p>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.name || 'No name set'}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleDisplay(user.role)}
              </span>
              <span className="text-xs text-gray-500">• {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Role</label>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleDisplay(user.role)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Account Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{user.role === 'borrower' ? '0' : 'N/A'}</div>
              <div className="text-xs text-gray-500">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{user.role === 'borrower' ? '0' : 'N/A'}</div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{user.role === 'borrower' ? '0' : 'N/A'}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{user.role === 'borrower' ? '0' : 'N/A'}</div>
              <div className="text-xs text-gray-500">Drafts</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
