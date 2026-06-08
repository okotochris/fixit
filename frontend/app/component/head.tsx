"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import InstallButton from "./installApp";

function Head() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  function getUser() {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.fullname || null);
    } else {
      setUsername(null);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("user");
    setUsername(null);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 md:px-6">
        
        {/* Logo */}
        <div className="flex items-center text-xl md:text-2xl font-bold text-[#FF8A00] dark:text-orange-400">
          <Link href="/" className="flex items-center">
            <img
              src="/fixit.png"
              alt="serviceHub"
              className="w-8 h-8 md:w-9 md:h-9"
            />
            <div className="ml-2">
              service<span className="text-blue-500 dark:text-blue-400">Hub</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link className="hover:text-[#FF8A00]" href="/">
            Home
          </Link>
          <Link className="hover:text-[#FF8A00]" href="/service">
            Find Worker
          </Link>
          <Link className="hover:text-[#FF8A00]" href="/available_jobs">
            Find Job
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Install App */}
          <InstallButton />

          {/* Auth */}
          {username ? (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>

              <Link
                href="/profile"
                className="px-5 py-2 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] text-white"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <button
                onClick={() => router.push("/signup")}
                className="px-5 py-2 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] text-white"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Head;