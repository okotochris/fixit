import React from "react";
import Footer from "../component/footer";
import Head from "../component/head";
import SubmitForm from "./submitForm";
import { Metadata } from "next";
import Link from "next/link";
import { LocateIcon, MessageCircle, MessageSquareDotIcon, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: 'Contact Us | ServiceHub',
    description: 'Get in touch with ServiceHub. We are here to help you find skilled professionals and manage your service needs.',
    keywords: [
        'ServiceHub',
        'Contact ServiceHub',
        'Find Professionals workers',
        'Home Services'
    ],
    openGraph: {
        title: 'Contact Us | ServiceHub',
        description: 'Contact ServiceHub for enquiries and support.',
        url: 'https://servicehub.space/contact',
        siteName: 'ServiceHub',
        type: 'website',
    }
}

export default function ContactUsPage() {

  return (
    <>
    <Head />
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-4 py-16">
      <div className="w-[80%] mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 md:p-14 border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-8">
          Have a question, feedback, or need support? Reach out to our team and we will get back to you as soon as possible.
        </p>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 shadow-sm">

    <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
       sponsor by Khrystal Tech Get in Touch 
    </h2>

    <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">
        Have questions or need assistance? Reach out to us through any of these channels.
    </p>

    <div className="space-y-5">

        {/* EMAIL */}
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <MessageSquareDotIcon size={20} />
            </div>

            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                </p>
                <a
                    href="mailto:support@servicehub.space"
                    className="text-sm font-semibold text-gray-800 dark:text-white hover:text-orange-500 transition"
                >
                    support@servicehub.space
                </a>
            </div>
        </div>

        {/* PHONE */}
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Phone size={20} />
            </div>

            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number
                </p>
                <a
                    href="tel:+2349157303724"
                    className="text-sm font-semibold text-gray-800 dark:text-white hover:text-orange-500 transition"
                >
                    +234 915 730 3724
                </a>
            </div>
        </div>

        {/* WHATSAPP */}
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                <MessageCircle size={20} />
            </div>

            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    WhatsApp
                </p>
                <Link
                    href="https://wa.me/2349157303724"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-gray-800 dark:text-white hover:text-orange-500 transition"
                >
                    Chat with us
                </Link>
            </div>
        </div>

        {/* ADDRESS */}
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <LocateIcon size={20} />
            </div>

            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Office Address
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Dawaki, Abuja, Nigeria
                </p>
              </div>
          </div>

      </div>
  </div>
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Need urgent help?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                For urgent account support or service issues, please email us with your order details and we&apos;ll respond quickly.
              </p>
            </div>
          </div>
          <SubmitForm />
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
