'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowRight, RefreshCw } from 'lucide-react'
import FancyLoader from '@/app/component/loading'
import MessageModal from '@/app/component/messageModal'

const server = process.env.NEXT_PUBLIC_API_URL

function Verify() {
  const [code, setCode] = useState<string[]>(Array(5).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto move to next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }

    setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')

    if (verificationCode.length !== 5) {
      setError('Please enter the complete 5-digit code')
      return
    }

    setError('')
    setLoading(true)

    try {
      const email = localStorage.getItem('email')
      const response = await fetch(`${server}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode, email }),
      })

      if (response.ok) {
        const res = await response.json()
        const { token, userDetails } = res

        localStorage.setItem('user', JSON.stringify(userDetails))
        localStorage.setItem('token', token)

        if (userDetails.role === 'client') {
          router.push('/service')
        } else {
          setMessage("Your professional account is ready. Next, complete your profile by adding cover photo, About Me, services, and work images..")
          setIsOpen(true)
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')

    try {
      const email = localStorage.getItem('email')
      const response = await fetch(`${server}/api/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        alert('A new verification code has been sent to your email')
      } else {
        setError('Failed to resend code. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while resending the code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-10 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl mb-5">
              <Mail className="w-9 h-9 text-orange-600 dark:text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Verify Your Email
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-[15px]">
              We sent a 5-digit verification code to<br />
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {localStorage.getItem('email')}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 5-Digit Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-4 text-center">
                Enter 5-Digit Code
              </label>
              <div className="flex gap-3 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-16 text-center text-3xl font-semibold bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-2xl text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || code.join('').length !== 5}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 dark:disabled:from-zinc-700 disabled:to-gray-400 py-4 rounded-2xl text-white font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                Didn&apos;t receive the code? Resend
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 dark:text-zinc-500 text-xs mt-6">
          Code expires in 10 minutes
        </p>
      </div>
      <MessageModal message={message} onClose={()=>router.push('/profile')} isOpen={isOpen} />
      {loading && <FancyLoader fullScreen message="Verifying your email..." />}
    </div>
  )
}

export default Verify