'use client'
import React, { useState } from 'react'
import { Wrench, MapPin, ChevronRight } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useRouter } from 'next/navigation'
import FancyLoader from '../component/loading'


function UpgradeToProfessional() {
  const [formData, setFormData] = useState({
    skill: '',
    location: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const skillsList = [
    'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Bricklayer',
    'Roofer', 'HVAC Technician', 'Cleaner', 'Handyman', 'Welder',
    'Tiler', 'Gardener', 'Mason', 'Locksmith', 'Appliance Repair'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.skill) {
      alert("Please select a skill")
      return
    }
     const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user) {
        router.push('/login');
         localStorage.setItem('redirectAfterLogin', '/update_to_professional');
        return
      }
    setLoading(true)
    // Add your API submission logic here
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upgrade-to-professional`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: user.id })
      })
      if (!data.ok) {
        const errorData = await data.json();
        alert(`Error: ${errorData.message || 'Failed to submit your request.'}`);
        return;
      }
      const result = await data.json();
      const {slug} = result;
      // Update user role in localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, role: 'worker', slug }));
     const redirectAfterLogin = localStorage.getItem('redirectAfterLogin') || '/available_jobs';
      if (redirectAfterLogin) {
  
        router.push(redirectAfterLogin);
        localStorage.removeItem('redirectAfterLogin');
        return;
      }
        router.push('/available_jobs');
      
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting your request. Please try again.")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-gradient-to-br from-zinc-950 via-zinc-900 to-black py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 mb-6">
            <Wrench className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-700 dark:text-zinc-300 mb-3">Upgrade to Professional</h1>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">
            Join our platform as a skilled professional
          </p>
        </div>

        {/* Form Card */}
        <div className="Dark:bg-zinc-900 dark:border  dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Skill Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-zinc-400 mb-2">
                Primary Skill
              </label>
              <input
                list="professions"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                placeholder="Select your main skill"
                className="w-full px-4 py-2 text-gray-800 dark:bg-zinc-800 border border-zinc-700 rounded-2xl dark:text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-all"
                required
              />
              <datalist id="professions">
                {skillsList.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold  text-gray-600 dark:text-zinc-400 mb-2">
                Service Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City and State (e.g., Lagos, Nigeria)"
                  className="w-full pl-11 pr-4 py-2 text-gray-800 dark:text-white dark:bg-zinc-800 border border-zinc-700 rounded-2xl placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold  text-gray-600 dark:text-zinc-400 mb-2">
                WhatsApp Contact Number
              </label>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="NG"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="react-phone-input  py-2 px-4 w-full bg-white dark:bg-zinc-800  dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <p className="text-xs  text-gray-600 dark:text-zinc-500 mt-1.5">
                This number will be used for customer communication
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.985]"
            >
              Upgrade My Account
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Your profile will be reviewed and approved within 24 hours
        </p>
      </div>
       {loading && <FancyLoader fullScreen message="Upgrading your account..." />}
    </div>
  )
}

export default UpgradeToProfessional