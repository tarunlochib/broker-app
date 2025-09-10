import Link from "next/link";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link 
        href="/signin"
        className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        Sign in
      </Link>
      <Link 
        href="/signup"
        className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
      >
        Get Started
      </Link>
    </div>
  );
}
