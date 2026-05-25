'use client'
import { AlertCircle, ChevronRight, Eye, EyeOff, Mail, Lock, MapPin, Phone, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { get } from "http"
import getLocation from "@/app/component/getUserLocation"
import FancyLoader from "@/app/component/loading"

const server = process.env.NEXT_PUBLIC_API_URL 

interface ClientFormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  location: string
  terms: boolean
}

interface FormErrors {
  [key: string]: string
}

// ============ FORM INPUT COMPONENT (Dark Mode) ============
const FormInput: React.FC<{
  label: string
  type?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  placeholder?: string
  icon?: React.ReactNode
  showPassword?: boolean
  onTogglePassword?: () => void
}> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  icon,
  showPassword,
  onTogglePassword,
}) => {
  const isPasswordField = type === 'password'

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-zinc-400">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-3.5 text-zinc-500">{icon}</div>}
        <input
          type={isPasswordField && showPassword ? 'text' : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 ${icon ? 'pl-11' : ''} ${
            isPasswordField && onTogglePassword ? 'pr-11' : ''
          } rounded-2xl border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 disabled:bg-zinc-800 disabled:cursor-not-allowed`}
        />
        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}

export default function ClientSignupForm() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    terms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ... (validateForm, handleChange, handleSubmit remain the same)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email'

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Please enter a valid phone number'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.terms) newErrors.terms = 'You must agree to the terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {lat:latitude, lng:longitude} = await getLocation()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${server}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, latitude, longitude }),
      })

      if (response.ok) {
        localStorage.setItem('email', formData.email)
        router.push('/signup/verify_email')
      } else {
        const data = await response.json()
        setErrors({ submit: data.message || 'Failed to create account.' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Password Strength Indicator (Dark Mode)
  const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = () => {
      let strength = 0
      if (password.length >= 8) strength++
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++
      return strength
    }

    const strength = getStrength()
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600']

    return (
      <div className="mt-2 space-y-1">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < strength ? strengthColors[strength - 1] : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        {password && (
          <p className="text-xs text-zinc-500">
            Password strength: <span className="font-semibold text-zinc-400">{strengthLabels[Math.max(0, strength - 1)]}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-zinc-400">Join FixIt as a client</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Your full name"
              icon={<User className="w-5 h-5" />}
              disabled={isLoading}
            />

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              disabled={isLoading}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="(+234) 000-0000"
              icon={<Phone className="w-5 h-5" />}
              disabled={isLoading}
            />

            <FormInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="City, State or Zip Code"
              icon={<MapPin className="w-5 h-5" />}
              disabled={isLoading}
            />

            <div>
              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Create a strong password"
                icon={<Lock className="w-5 h-5" />}
                disabled={isLoading}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {formData.password && <PasswordStrengthIndicator password={formData.password} />}
            </div>

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              icon={<Lock className="w-5 h-5" />}
              disabled={isLoading}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="w-5 h-5 mt-1 rounded-lg border-2 border-zinc-600 bg-zinc-900 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-zinc-400">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-500 hover:text-orange-400 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-500 hover:text-orange-400 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-400 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errors.terms}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-zinc-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
       {isLoading && <FancyLoader fullScreen message="Signing up..." />}
    </div>
  )
}