'use client'

import Link from 'next/link'
import { User, Wrench, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 mb-4">
            <Wrench className="w-8 h-8 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">ServiceHub</h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400">
            Connect with skilled professionals or find your next client
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-5 mb-10">
          {/* Client Card */}
          <button
            onClick={() => router.push('/signup/client_signup')}
            className="w-full group relative overflow-hidden rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all duration-300 active:scale-[0.985]"
          >
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/10 transition-colors">
                  <User className="w-8 h-8 text-gray-600 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
                </div>
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">I am a Client</h3>
                <p className="text-gray-600 dark:text-zinc-400 text-[15px] leading-relaxed mb-5">
                  Find reliable professionals for your home projects
                </p>
                <div className="flex items-center text-orange-600 dark:text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                  Get Started 
                  <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
          </button>

          {/* Worker Card */}
          <button
            onClick={() => router.push('/signup/worker_signup')}
            className="w-full group relative overflow-hidden rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all duration-300 active:scale-[0.985]"
          >
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/10 group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
                  <Wrench className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                </div>
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">I am a Skilled Worker</h3>
                <p className="text-gray-600 dark:text-zinc-400 text-[15px] leading-relaxed mb-5">
                  Grow your business and find new clients
                </p>
                <div className="flex items-center text-orange-600 dark:text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                  Get Started 
                  <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-zinc-500">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}