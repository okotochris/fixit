"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Briefcase, Search, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // ❌ hide on auth pages
  const hiddenRoutes = ["/signup", "/signup/worker_signup", "/signup/client_signup", "/forgot-password"];

  if (hiddenRoutes.includes(pathname)) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-around py-2">

      <Link href="/" className="flex flex-col items-center text-xs">
        <Home className={isActive("/") ? "text-blue-500" : "text-gray-500"} />
        <span>Home</span>
      </Link>

      <Link href="/service" className="flex flex-col items-center text-xs">
        <Search className={isActive("/service") ? "text-blue-500" : "text-gray-500"} />
        <span>Workers</span>
      </Link>

      <Link href="/available_jobs" className="flex flex-col items-center text-xs">
        <Briefcase className={isActive("/available_jobs") ? "text-blue-500" : "text-gray-500"} />
        <span>Jobs</span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center text-xs">
        <User className={isActive("/profile") ? "text-blue-500" : "text-gray-500"} />
        <span>Profile</span>
      </Link>

    </div>
  );
}