"use client";

import { useEffect, useState } from "react";

interface ContactPopupProps {
    isOpen: boolean;
    onSave: (phone: string) => void;
}

export default function ContactPopup({
    isOpen,
    onSave,
}: ContactPopupProps) {
    const [phone, setPhone] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
       async function setStatus() {
         if (isOpen) {
            setTimeout(() => setShow(true), 10);
        } else {
            setShow(false);
        }
       }
       setStatus()
    }, [isOpen]);

    if (!isOpen) return null;



    const handleSave = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        try {
            setLoading(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/update-phone`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: user.id, phone }),
                }
            );

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem("user", JSON.stringify(updatedUser.user));
                onSave(phone);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                className={`w-[90%] max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-zinc-900 ${show
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-8 scale-95 opacity-0"
                    }`}
            >
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Add Your Contact
                </h2>

                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    You must add your phone number to continue requesting services.
                </p>

                <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <button
                    onClick={handleSave}
                    className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600"
                >
                    {loading ?
                        <div className="flex items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500"></div>
                        </div>
                        :
                        " Save & Continue"
                    }

                </button>
            </div>
        </div>
    );
}