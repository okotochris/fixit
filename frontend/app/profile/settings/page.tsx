'use client'

import { User } from '@/app/component/interface';
import FancyLoader from '@/app/component/loading';
import MessageModal from '@/app/component/messageModal';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


function Settings() {
    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [services, setServices] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<string>('')
    const [open, setOpen] = useState(false)

    const [form, setForm] = useState({

        fullname: '',
        location: '',
        phone: '',
        role: '',
        skills: '',
        state: '',
        country: '',
        description:''
    })

    useEffect(() => {
       async function getUser(){
         const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            router.push('/')
            return
        }

        try {
            const parsedUser: User = JSON.parse(savedUser)

            setUser(parsedUser)
            setServices(parsedUser.services || [])

            setForm({
               
                fullname: parsedUser.fullname || '',
                location: parsedUser.location || '',
                phone: parsedUser.phone || '',
                role: parsedUser.role || '',
                skills: parsedUser.skills || '',
                state: parsedUser.state || '',
                country: parsedUser.country || '',
                description:parsedUser.description || '',
            })
        } catch (error) {
            console.error('Error loading user:', error)
            router.push('/')
        } finally {
            setLoading(false)
        }
       }
       getUser()
    }, [router])

    const deleteService = (serviceToDelete: string) => {
        const updatedServices = services.filter(
            service => service !== serviceToDelete
        )

        setServices(updatedServices)

        if (user) {
            const updatedUser = {
                ...user,
                services: updatedServices
            }

            setUser(updatedUser)
           
        }
    }
    async function handleSave(e:React.FormEvent){
        e.preventDefault()
        const id =user?.id;
        try{
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-update`, {
                method:"PATCH",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({...form, services, id})
            })
            if(!response.ok){
                setOpen(true)
                setMessage('something went wrong try again')
                return
            }
            const {user} = await response.json()
            console.log(user)
            localStorage.setItem('user', JSON.stringify(user))
        }catch(err){
             setOpen(true)
             setMessage('server error')
             console.log(err)
        }finally{
            setLoading(false)
        }
    }

    if (loading) {
        return (
             <FancyLoader fullScreen message={`Fetching user info`} />
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-6">
            <MessageModal message={message} isOpen={open} onClose={()=>setOpen(false)} />
            {/* PAGE HEADER */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Account Settings
                    </h1>
                    <p className="w-48 md:w-full mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your personal information and services.
                    </p>
                </div>
                <button
                    onClick={()=>{signOut(); localStorage.clear(); router.push('/')}}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Logout
                </button>

            </div>
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">

                    {Object.entries({
                        fullname: 'Full Name',
                        phone: 'Phone Number',
                        location: 'Address',
                        state: 'State',
                        country: 'Country',
                        skills: 'Skills'
                    }).map(([key, label]) => (
                        <div key={key}>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {label}
                            </label>

                            <input
                                type="text"
                                value={
                                    key === 'role'
                                        ? form[key as keyof typeof form].charAt(0).toUpperCase() +
                                        form[key as keyof typeof form].slice(1)
                                        : form[key as keyof typeof form]
                                }
                                readOnly={key === 'role'}
                                onChange={(e) => {
                                    if (key !== 'role') {
                                        setForm(prev => ({
                                            ...prev,
                                            [key]: e.target.value
                                        }))
                                    }
                                }}
                                className={`
                            w-full rounded-xl border px-4 py-3 text-sm outline-none transition
                            ${key === 'role'
                                        ? 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                        : 'bg-white text-gray-900 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-950 dark:text-white dark:border-gray-700 dark:focus:border-orange-500'
                                    }
                        `}
                            />
                        </div>
                    ))}
                   
                </div>
                <label className="my-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    About me
                </label>
                <textarea 
                    onChange={(e)=>setForm({...form, description:e.target.value})}
                    value={form.description}
                    rows={4}
                    className=' w-full rounded-xl border px-4 py-3 text-sm outline-none transition bg-white text-gray-900 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-950 dark:text-white dark:border-gray-700 dark:focus:border-orange-500'>
                </textarea>
            </section>

            {/* SERVICES */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            My Services
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            View and manage the services you offer.
                        </p>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                        {services.length} Services
                    </span>
                </div>

                {services.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-700">
                        <div className="mb-3 text-3xl">🛠️</div>

                        <h3 className="font-semibold text-gray-800 dark:text-white">
                            No services available
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            You currently have no registered services.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">

                        {services.map((service, index) => (
                            <div
                                key={`${service}-${index}`}
                                className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-orange-300 dark:border-gray-800 dark:hover:border-orange-500/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.42 15.17L17.25 21 21 17.25l-5.83-5.83M11.42 15.17L5.5 21 3 18.5l5.83-5.83m2.59 2.5L14 11.59a3 3 0 0 0-4.24-4.24L6.59 10.5"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">
                                            {service}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Registered service
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => deleteService(service)}
                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                    </div>
                )}
                 <div className="mt-6 flex justify-end">
                    <button
                        
                        onClick={handleSave}
                        className="rounded-xl bg-orange-500 px-6 mb-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </section>

        </div>
    )
}

export default Settings