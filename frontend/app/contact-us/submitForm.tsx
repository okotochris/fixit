'use client'
import React, { useState } from 'react'
import FancyLoader from '../component/loading'
import MessageModal from '../component/messageModal'


function SubmitForm() {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        message: ""
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setLoading(true)
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/emailservice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const { data, message } = await result.json()
            if (!result.ok) {
                setMessage(message || 'Somthing went wrong try again')
                setOpen(true)
                return
            }
            setOpen(true)
            setMessage(message)
            setForm({fullname:'', email:'', message:"" })

        } catch (err) {
            console.log(err)
            setMessage("Server error")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            {loading && <FancyLoader fullScreen message='Sending email'/>}
            <MessageModal message={message} isOpen={open} onClose={()=>setOpen(false)}/>
            <form
                onSubmit={handleSubmit}
                className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                        onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                        type="text" placeholder="Your name" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                    <textarea
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={6} placeholder="How can we help?" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <button
                    type="submit" className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 transition">
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default SubmitForm
