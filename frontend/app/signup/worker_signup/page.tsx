'use client';
import 'react-phone-number-input/style.css';
import { useEffect, useState } from "react";
import { User, Mail, Lock, MapPin, ChevronRight, AlertCircle, EyeOff, Eye, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import PhoneInput from 'react-phone-number-input';
import getLocation from '@/app/component/getUserLocation';
import FancyLoader from '@/app/component/loading';


const server = process.env.NEXT_PUBLIC_API_URL;

interface WorkerFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
  skills: string;
  hourlyRate: string;
  profilePhoto: File | null;
  terms: boolean;
  role: string;
  latitude:number;
  longitude:number;
}
type Skill = {
  skill:string
}
// ==================== REUSABLE COMPONENTS ====================

const FormInput: React.FC<{
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}> = ({
  label, type = 'text', name, value, onChange, error, placeholder, icon,
  showPassword, onTogglePassword, disabled
}) => {
  const isPasswordField = type === 'password';

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500">{icon}</div>}
        <input
          type={isPasswordField && showPassword ? 'text' : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} ${isPasswordField && onTogglePassword ? 'pr-11' : ''} 
            rounded-2xl border transition-all duration-200 bg-white dark:bg-zinc-900
            ${error 
              ? 'border-red-300 dark:border-red-700 focus:border-red-500' 
              : 'border-gray-200 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-orange-600 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900'
            } focus:outline-none disabled:bg-gray-100 dark:disabled:bg-zinc-800`}
        />
        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
};

const PhotoUpload: React.FC<{
  onPhotoSelect: (file: File) => void;
  preview?: string | null;
}> = ({ onPhotoSelect, preview }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Profile Photo (Optional)
      </label>
      <label
        htmlFor="photo-upload"
        className="flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:border-orange-500 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-all duration-200"
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <img src={preview} alt="Preview" className="w-24 h-24 rounded-2xl object-cover mb-3 ring-2 ring-orange-200 dark:ring-orange-900" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to change photo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload a photo</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG or PNG • Max 5MB</p>
          </div>
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPhotoSelect(file);
        }}
        className="hidden"
        id="photo-upload"
      />
    </div>
  );
};

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200 dark:bg-zinc-700'}`}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Strength: <span className="font-semibold text-gray-700 dark:text-gray-300">
            {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
          </span>
        </p>
      )}
    </div>
  );
};

// ==================== MAIN SIGNUP FORM ====================
export default function WorkerSignupForm() {
  const [formData, setFormData] = useState<WorkerFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    skills: '',
    hourlyRate: '',
    profilePhoto: null,
    terms: false,
    role: "worker",
    latitude:0,
    longitude:0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [skillsList, setSkillsList] = useState<Skill[]>()
  useEffect(()=>{
   
    async function setLocation(){
      
      const loc =await getLocation();
      if(!loc){
        console.log("Something went wrong")
        return
      }
      const { lat, lng } = loc
      setFormData({...formData, latitude:lat, longitude:lng})
      try{
        const result =  await fetch(`${server}/api/skills`)
        if(!result){
          return
        }
        const {data} = await result.json()
        setSkillsList(data)
      }catch(err){
        console.log(err)
      }
    }
    setLocation()
  }, [])



  const router = useRouter();
  

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.skills.trim()) newErrors.skills = 'Please select your skill';
    if (!formData.terms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handlePhotoSelect = (file: File) => {
    setFormData(prev => ({ ...prev, profilePhoto: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value as string | Blob);
    });

    try {
      const emailCheck = await fetch(`${server}/api/check_email?email=${formData.email}`);
      const isUsed = await emailCheck.json();

      if (isUsed) {
        setMessage('Email has already been used' );
        setIsOpen(true)
        setIsLoading(false)
        return;
      }

      const response = await fetch(`${server}/api/signup`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        localStorage.setItem('email', formData.email);
        router.push('/signup/verify_email');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create account' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      <div className="flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-zinc-800 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Become a Professional</h2>
              <p className="text-gray-600 dark:text-gray-400">Grow your business on FixIt</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="Your full name"
                icon={<User className="w-5 h-5" />}
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
              />

              {/* Phone Input */}
              <div className="space-y-2 pr-2 ">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  className="px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-2xl focus:border-orange-500 dark:focus:border-orange-600 outline-none transition-colors react-phone-input dark:bg-zinc-900 "
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>

              <FormInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="City and State (e.g., Lagos, Nigeria)"
                icon={<MapPin className="w-5 h-5" />}
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
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Your Skill
                </label>

                <input
                  type="text"
                  name="skills"
                  list="skills-list"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      skills: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl focus:border-orange-500 dark:focus:border-orange-600 outline-none transition-colors"
                  placeholder="Choose your main skill"
                />

                <datalist id="skills-list">
                  {skillsList && skillsList.map((skill, i) => (
                    <option key={i} value={skill.skill} />
                  ))}
                </datalist>

                {errors.skills && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.skills}
                  </p>
                )}
              </div>

              <FormInput
                label="Hourly Rate (Optional)"
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="50"
                icon={<span className="text-gray-400">$</span>}
              />

              <PhotoUpload onPhotoSelect={handlePhotoSelect} preview={photoPreview} />

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 accent-orange-600 dark:accent-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-600 dark:text-orange-500 hover:underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="text-orange-600 dark:text-orange-500 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-600 dark:text-orange-500 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
       {isLoading && <FancyLoader fullScreen message="Signing up..." />}
    </div>
  );
}