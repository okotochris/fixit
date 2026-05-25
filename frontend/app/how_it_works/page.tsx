import React from 'react'
import Head from '../component/head'
import Footer from '../component/footer'
import { Search, Star, Check, Link, Verified, ShieldCheck} from 'lucide-react'

function How_it_works() {
    const instructions = [
        {icon:<Search className='text-blue-500'/>, title: "Find a service", description: "Browse and select from a wide range of services available in your area."},
        {icon:<Link className='text-blue-500'/>, title: "Connect with professionals", description: "Connect directly with pros. Discuss your project details, share photos, and get instant price estimates.."},
        {icon:<Check className='text-blue-500'/>, title: "Get it done", description: "Sit back and relax while your chosen professional takes care of the job."},
        {icon:<Star className='text-blue-500'/>, title: "Pay, Rate and review", description: "After the job is done, rate your experience and leave a review to help others make informed decisions."},
    ]
  return (
    
    <div>
        <Head/>
        <div className="h-14" />
        <div>
            <div className='flex flex-col items-center justify-center max-w-4xl mx-auto px-4'>
                <h1 className='text-3xl font-bold text-center mt-10'>Getting work done has never been easier</h1>
                <p className='text-center text-gray-600 mt-4'>From quick fixes to major renovations, FixIt connects you with trusted<br/>
p                  rofessionals in your area. Simple, secure, and stress-free.</p>

                <div className='bg-[#E8F3FF] h-13.25 w-92 flex  flex-row mt-10 justify-center items-center'>
                    <div className='bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg h-10.25  w-43 text-center flex items-center justify-center'>
                        I need a service
                    </div>
                    <div className='bg-[#E8F3FF] dark:bg-gray-800 h-10.25  w-43 text-center flex items-center justify-center'>
                        I offer a service
                    </div>
                </div>
            </div>
        </div>
        <div className='h-25.25'></div>
        <div className="w-full bg-[#E8F3FF] flex flex-col justify-center items-center p-10">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full max-w-6xl">
            {instructions.map((item, index) => (
            <div
                key={index}
                className=" group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
                {/* Top accent line */}
                <div className="h-1.5 bg-blue-500 w-full" />

                <div className="p-6 md:p-7 flex flex-col flex-grow items-center text-center">
                {/* Step number + icon */}
                <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-3xl shadow-sm">
                    {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-gray-800">
                    {index + 1}
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed flex-grow">
                    {item.description}
                </p>
                </div>
            </div>
            ))}
            </div>
             <div className='h-25.25'></div>
            <div className="w-full md:w-[80%] bg-white py-16 px-4">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* LEFT CONTENT */}
                    <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Your safety is our priority
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        We take trust seriously. All professionals on FixIt undergo a 
                        comprehensive background check and identity verification process.
                    </p>

                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <Verified className="text-green-500 w-5 h-5" />
                        <span>Verified Identities</span>
                        </div>

                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <Check className="text-green-500 w-5 h-5" />
                        <span>Background Checks</span>
                        </div>

                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <ShieldCheck className="text-green-500 w-5 h-5" />
                        <span>License & Insurance Verification</span>
                        </div>
                    </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="flex-1 w-full max-w-md h-80 md:h-105 lg:h-125 rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src="https://i.pravatar.cc/600?img=33"
                        alt="Verified professional"
                        className="w-full h-full object-cover"
                    />
                    </div>

                </div>
            </div>

            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
                Frequently Asked Questions
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 w-full max-w-5xl">
                {/* FAQ Item 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md focus-within:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    How do I book a service?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Yes, searching for professionals and requesting quotes is completely free for homeowners. You only pay for the service you book.
                </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md focus-within:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    How do I pay the professional?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    All payments are handled securely through the FixIt platform. Funds are held in escrow and released when the job is marked complete.
                </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md focus-within:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    What if I&apos;m not satisfied?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    If you&apos;re not satisfied with a professional&apos;s work, contact our support team within 24 hours of job completion. We&apos;ll help resolve any issues or provide a refund if necessary.
                </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md focus-within:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Are the professionals insured?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Yes, all professionals on FixIt are required to carry valid insurance and licenses. We verify these credentials before listing any professional on our platform.
                </p>
                </div>
            </div>

            <div className="w-full h-70.25 flex flex-col items-center justify-center bg-[#1565D8] p-4 mt-10">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Ready to tackle your to-do list?</h1>
                <p className="text-gray-200 mt-4">
                Join thousands of homeowners who trust FixIt to get their jobs done right.
                </p>
                <button className="mt-6 bg-white hover:bg-gray-300 text-[#1565D8] font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                Find a Professional
                </button>
            </div>
            </div>
           
        </div>

       
        <Footer/>
    </div>
  )
}

export default How_it_works
