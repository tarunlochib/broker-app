import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

export default async function ProfilePage() {
  const session = await requireAuth();
  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { 
      id: true,
      email: true, 
      name: true, 
      role: true, 
      createdAt: true 
    } 
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          <p className="text-gray-600">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Professional Header */}
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account information and security settings
            </p>
          </div>

          {/* Profile Information */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <ProfileInfo user={user} />
          </div>

          {/* Profile Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <ProfileForm user={user} />
          </div>

          {/* Password Change Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <PasswordChangeForm />
          </div>
        </div>
      </main>
    </div>
  );
}


