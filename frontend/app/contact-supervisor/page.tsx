
'use client'

import React, { useEffect, useState } from 'react'
import { ShieldCheck, User2, Building2, MessageSquare, Send, ClipboardList} from 'lucide-react'
import Head from '../component/head'
import Footer from '../component/footer'
import MessageModal from '../component/messageModal'
import FancyLoader from '../component/loading'

import { useRouter } from 'next/navigation'


function SupervisorRequest() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        id:'',
        fullname: '',
        email: '',
        phone: '',
        country: '',
        projectType: '',
        projectLocation: '',
        projectStatus: '',
        supervisionType: '',
        budget: '',
        description: '',
        contactMethod: 'WhatsApp'
    })

    const [loading, setLoading] = useState(false)
   
    const router = useRouter()
    useEffect(()=>{
        async function getUser(){
            const savedUser = localStorage.getItem('user')
            if(!savedUser){
                router.push('/login')
                return
            }
            const userData = JSON.parse(savedUser)
            setForm({
                id: userData?.id || '',
                fullname: userData?.fullname || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
                country: userData?.country || '',
                projectType: '',
                projectLocation: '',
                projectStatus: '',
                supervisionType: '',
                budget: '',
                description: '',
                contactMethod: 'WhatsApp'
            })
        }
        getUser()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)

        try {
           const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hirer-supervisor`, {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(form)
           })
           const {message} = await result.json()
            setMessage(message)
            setOpen(true)
            setForm({
                id: '',
                fullname: '',
                email: '',
                phone:'',
                country: '',
                projectType: '',
                projectLocation: '',
                projectStatus: '',
                supervisionType: '',
                budget: '',
                description: '',
                contactMethod: 'WhatsApp'
            })
           
        } catch (error) {
            console.error(error)
            setMessage('server error')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = `
        w-full rounded-xl border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-950 text-gray-900 dark:text-white
        px-4 py-3 text-sm outline-none transition
        focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10
        placeholder:text-gray-400
    `

    const labelStyle = `
        mb-2 block text-sm font-medium
        text-gray-700 dark:text-gray-300
    `

    return (
        <>
            <Head />
            <div className="h-4"></div>
            {loading && <FancyLoader fullScreen message='Sending request'/>}
            <MessageModal message={message} isOpen={open} onClose={()=>setOpen(false)}/>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">

                <div className="mx-auto max-w-3xl">

                    {/* HEADER */}
                    <div className="text-center mb-8">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                            <ShieldCheck size={32} />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Hire a Project Supervisor
                        </h1>

                        <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            Are you living abroad and managing a project back home?
                            Tell us about your project and let us help you find
                            supervision support.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-8 shadow-sm space-y-8"
                    >

                        {/* PERSONAL DETAILS */}
                        <section>

                            <div className="mb-5 flex items-center gap-3">
                                <User2 className="text-orange-500" size={21} />
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Your Information
                                </h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">

                                <div>
                                    <label className={labelStyle}>Full Name *</label>
                                    <input
                                        required
                                        name="fullname"
                                        value={form.fullname}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>Phone / WhatsApp *</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+44 000 000 0000"
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>Country of Residence</label>
                                    <input
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        placeholder="e.g. United Kingdom"
                                        className={inputStyle}
                                    />
                                </div>

                            </div>
                        </section>

                        <div className="border-t border-gray-100 dark:border-gray-800" />

                        {/* PROJECT DETAILS */}
                        <section>

                            <div className="mb-5 flex items-center gap-3">
                                <Building2 className="text-orange-500" size={21} />
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Project Information
                                </h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">

                                <div>
                                    <label className={labelStyle}>Project Type *</label>
                                    <select
                                        required
                                        name="projectType"
                                        value={form.projectType}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="">Select project type</option>
                                        <option value="Residential Building">Residential Building / House</option>
                                        <option value="Office">Office</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Hospital">Hospital</option>
                                        <option value="Commercial Building">Commercial Building</option>
                                        <option value="Renovation">Renovation</option>
                                        <option value="Road Construction">Road Construction</option>
                                        <option value="Other">Other Project</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelStyle}>Project Location *</label>
                                    <input
                                        required
                                        name="projectLocation"
                                        value={form.projectLocation}
                                        onChange={handleChange}
                                        placeholder="Address, City, State, country"
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>Current Project Status *</label>
                                    <select
                                        required
                                        name="projectStatus"
                                        value={form.projectStatus}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="">Select status</option>
                                        <option value="Not Started">Not Started</option>
                                        <option value="Planning Stage">Planning Stage</option>
                                        <option value="Ongoing Construction">Ongoing Construction</option>
                                        <option value="Renovation Ongoing">Renovation Ongoing</option>
                                        <option value="Near Completion">Near Completion</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelStyle}>Type of Supervision *</label>
                                    <select
                                        required
                                        name="supervisionType"
                                        value={form.supervisionType}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="">Select supervision type</option>
                                        <option value="Daily Supervision">Daily Supervision</option>
                                        <option value="Weekly Supervision">Weekly Supervision</option>
                                        <option value="Periodic Inspection">Periodic Inspection</option>
                                        <option value="Full Project Monitoring">Full Project Monitoring</option>
                                        <option value="One-time Inspection">One-time Inspection</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelStyle}>
                                        Estimated Supervision Budget (Optional)
                                    </label>
                                    <input
                                        name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                        placeholder="e.g. ₦100,000 monthly or Negotiable"
                                        className={inputStyle}
                                    />
                                </div>

                            </div>
                        </section>

                        <div className="border-t border-gray-100 dark:border-gray-800" />

                        {/* DESCRIPTION */}
                        <section>

                            <div className="mb-5 flex items-center gap-3">
                                <ClipboardList className="text-orange-500" size={21} />
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Tell Us More About Your Project
                                </h2>
                            </div>

                            <label className={labelStyle}>
                                Project Description *
                            </label>

                            <textarea
                                required
                                rows={5}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your project, what you need supervised, and any specific requirements..."
                                className={`${inputStyle} resize-none`}
                            />

                        </section>

                        {/* CONTACT PREFERENCE */}
                        <section>

                            <div className="mb-4 flex items-center gap-3">
                                <MessageSquare className="text-orange-500" size={21} />
                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                    Preferred Contact Method
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">

                                {['WhatsApp', 'Phone Call', 'Email', 'SMS'].map(method => (
                                    <label
                                        key={method}
                                        className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                                            form.contactMethod === method
                                                ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                                                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value={method}
                                            checked={form.contactMethod === method}
                                            onChange={handleChange}
                                            className="accent-orange-500"
                                        />
                                        {method}
                                    </label>
                                ))}

                            </div>
                        </section>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                        >
                            {loading ? 'Submitting Request...' : 'Submit Supervision Request'}
                            {!loading && <Send size={18} />}
                        </button>

                        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                            Our team will review your request and contact you to
                            discuss the supervision arrangements.
                        </p>

                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SupervisorRequest
