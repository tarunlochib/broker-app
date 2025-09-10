import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-2 rounded-lg bg-white/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
          Mortgage Portal
        </span>
        <span className="text-xs text-gray-500 -mt-1">Secure & Simple</span>
      </div>
    </Link>
  );
}
