'use client'
import { useEffect, useState } from "react";
import Head from "../component/head";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import getLocation from "../component/getUserLocation";
import Link from "next/link";
import FancyLoader from "../component/loading";

const serverUrl = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
  const router = useRouter();
   const { data: session } = useSession();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
   async function checkSession(){
     if (session) {
      setLoading(true);
      const email = session.user?.email;
      const fullName = session.user?.name;
      const profilePhoto = session.user?.image;
      const  {lat:latitude, lng:longitude} = await getLocation();
      try{
        const userData =  await fetch(`${serverUrl}/api/external-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName, profilePhoto, latitude, longitude }),
        });

        if (!userData.ok) {
          console.error("Social login failed:", userData.status);
          return;
        }
        const userInfo = await userData.json();
        const {token, userDetails} =  userInfo
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("token", token);
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      }
      catch(err){
        console.error("Error parsing session user data:", err);
        return;
      }
      finally {
        setLoading(false);
      }
    }
   }
   checkSession();
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);

  if (email === "" || password === "") {
    setError("Fields cannot be empty");
    return; // stop execution
  }

  try {
    const res = await fetch(`${serverUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Check HTTP status first
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Error ${res.status}`);
    }

    const user = await res.json();
    const { userDetails, token } = user;

    localStorage.setItem("user", JSON.stringify(userDetails));
    localStorage.setItem("token", token);

    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
    localStorage.removeItem("redirectAfterLogin");
    router.push(redirectPath);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }finally{
    setLoading(false);
  }
}

  return (
    <>
    <Head/>
    <div className="h-16" ></div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo / Brand */}
        <div className="text-center">
         
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with trusted home service professionals
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Sign in to your account
          </h2>
          {error && (
          <div className="flex items-center border border-red-500 bg-red-50 text-red-700 px-4 py-3 rounded-lg mt-2">
            {/* Error Icon */}
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="you@example.com"
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forgot password + Remember me */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition duration-150"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Social login (optional – comment out if not needed) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                 onClick={() => signIn("google")}
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
              >
                <span className="sr-only">Sign in with Google</span>
                Google
              </button>
              <button
                onClick={() => signIn("apple")}
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
              >
                <span className="sr-only">Sign in with Apple</span>
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
          >
            Create one now
          </Link>
        </p>
      </div>
     {loading && <FancyLoader fullScreen message="Checking authentication..." />}
    </div>
    </>
  );
}