import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  current: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function NavItem({ href, current, children, icon }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
        current 
          ? "bg-blue-50 text-blue-700 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {icon && (
        <span className={`transition-colors duration-200 ${
          current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
        }`}>
          {icon}
        </span>
      )}
      <span>{children}</span>
      {current && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
      )}
    </Link>
  );
}

interface NavigationMenuProps {
  role?: string;
}

export function NavigationMenu({ role }: NavigationMenuProps) {
  const pathname = usePathname();

  // Base navigation items
  const baseNavItems = [
    {
      href: "/applications",
      label: "Applications",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      current: pathname?.startsWith("/applications") ?? false
    },
    {
      href: "/profile",
      label: "Profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      current: pathname === "/profile"
    }
  ];

  // Role-specific dashboard
  let dashboardItem;
  if (role === "broker") {
    dashboardItem = {
      href: "/broker",
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      current: pathname?.startsWith("/broker") ?? false
    };
  } else if (role === "admin") {
    dashboardItem = {
      href: "/admin",
      label: "Admin",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      current: pathname === "/admin"
    };
  } else {
    // Default dashboard for borrowers
    dashboardItem = {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      current: pathname === "/dashboard"
    };
  }

  // Combine dashboard with base items
  const navItems = [dashboardItem, ...baseNavItems];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          current={item.current}
          icon={item.icon}
        >
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
}
