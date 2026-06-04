"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

function Head() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  async function getUser() {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.fullname || null);
      return;
    }
    setUsername(null);
  }

  useEffect(() => {
   async function getUserDeta(){
     getUser();
   }
   getUserDeta()
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 md:px-6">
        {/* Logo */}
      
        <Link href={'/'}>
          <div className="flex items-center text-xl md:text-2xl font-bold text-[#FF8A00] dark:text-orange-400">
          <img
            src="/fixit.png"
            alt="serviceHub"
            className="w-8 h-8 md:w-9 md:h-9"
          />
          <div className="ml-2">service<span className="text-blue-500 dark:text-blue-400">Hub</span></div>
        </div>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition"
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition"
            href="/service"
          >
            Find Worker
          </Link>
          <Link
            className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition"
            href="/available_jobs"
          >
            Find Job
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {username ? (
            <button
              onClick={async () => {
                localStorage.clear();
                await signOut();
                getUser();
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
            >
              Login
            </Link>
          )}

          {username ? (
            <Link
              href="/profile"
              className="px-5 py-2 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] dark:bg-orange-600 dark:hover:bg-orange-500 text-white transition shadow-sm font-medium"
            >
              Profile
            </Link>
          ) : (
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] dark:bg-orange-600 dark:hover:bg-orange-500 text-white transition shadow-sm font-medium"
            >
              create account
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex flex-col px-4 py-5 space-y-5 font-medium">
            <Link
              className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition py-1"
              href="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition py-1"
              href="/service"
              onClick={() => setOpen(false)}
            >
              Find Worker
            </Link>
            <Link
              className="hover:text-[#FF8A00] dark:hover:text-orange-400 transition py-1"
              href="/available_jobs"
              onClick={() => setOpen(false)}
            >
              Find Job
            </Link>

            <hr className="border-gray-200 dark:border-gray-700 my-2" />

            {username ? (
              <button
                onClick={async () => {
                  localStorage.clear();
                  getUser();
                  await signOut();
                  setOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center text-gray-700 dark:text-gray-300"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}

            {username ? (
              <Link
                href="/profile"
                className="w-full px-5 py-3 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] dark:bg-orange-600 dark:hover:bg-orange-500 text-white transition shadow-sm text-center font-medium"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <button
                onClick={() => {
                  router.push("/signup");
                  setOpen(false);
                }}
                className="w-full px-5 py-3 rounded-lg bg-[#FF8A00] hover:bg-[#FF6A00] dark:bg-orange-600 dark:hover:bg-orange-500 text-white transition shadow-sm font-medium"
              >
                create account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Head;