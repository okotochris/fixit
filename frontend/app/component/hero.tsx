'use client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


function Hero() {
  const [isLogin, setIsLogin] = useState(false)
  const [searItem, setSearchItem] = useState('')
  const router = useRouter()
  useEffect(()=>{
    async function isLogin(){
      const user = localStorage.getItem('user')
      if(!user){
        return
      }
      setIsLogin(true)
    }
    isLogin()
  }, [])
  return (
     <header
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        {/* Darker overlay in both modes, stronger in dark mode */}
        <div className="absolute inset-0 bg-black/65 dark:bg-black/75" />

        <div className="relative container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Expert Help for Your <br /> Home Projects
          </h1>

          <p className="text-lg text-gray-200 dark:text-gray-300  drop-shadow">
            Connect with thousands of skilled professionals in your area for any job, big or small.
          </p>
          <div className='m-6'>
           {
            !isLogin &&  <Link
            href={'/signup'}
              className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition shadow-sm font-medium"
            >
              create account
            </Link>
            
           }
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-xl shadow-xl max-w-3xl mx-auto gap-3 border border-gray-200 dark:border-gray-700">
            <Search className="hidden lg:block mx-2 text-gray-500 dark:text-gray-400" size={20} />

            <input
              type="text"
              className="w-full md:w-1/2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="What service do you need?"
              onChange={(e)=>setSearchItem(e.target.value)}
            />

            <button 
              onClick={()=>router.push(`/services/${searItem}`)}
              className="px-6 py-2.5 bg-[#FF8A00] hover:bg-[#FF6A00] dark:bg-orange-600 dark:hover:bg-orange-500 text-white rounded-lg font-medium transition shadow-md">
              
              Search
            </button>
          </div>
        </div>
         
      </header>
  )
}

export default Hero
