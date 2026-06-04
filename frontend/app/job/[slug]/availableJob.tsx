'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Phone, MessageCircle, Clock } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import getDistanceFromUser from '@/app/component/checkJobLocation';
import { useImageViewer } from '@/app/component/useImageView';
import { ImageViewer } from '@/app/component/imageViewer';
import ProAccountPopup from '@/app/job/[slug]/proAccountPopup';
import ContactPopup from '@/app/component/contactPopUP';
import { formatDate } from '@/app/component/formatDate';



type Job = {
  id: number;
  client_photo: string;
  client_fullname: string;
  client_contact: string;
  scheduled_date: string;
  address: string;
  client_slug: string;
  job_title: string;
  service_type: string;
  description: string;
  job_photos: string[];
  slug: string;
  status: string;
  time: string;
  quote_amount: string; // kept as string (common from API)
  latitude: number;
  longitude: number;
  created_at:string
  worker_id:string  
  client_id:number
};
type User ={
  id:string
  role:string
}
export default function AvailableJob({ job }: { job: Job }) {
  const { image, openImage, closeImage } = useImageViewer();
  const [location, setLocation ] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);
   const [isClient, setIsClient] = useState(false);
  const [jobStatus, setJobStatus] = useState('pending')
  const [user, setUser] = useState<User|null>(null)
  const [isRejectingJob, setIsRejectingJob] = useState(false)
  const router = useRouter()
  const pathName = usePathname()

  // Get user's location and calculate distance to job location
  useEffect(()=>{
    async function getLocation(){
      const distance = await getDistanceFromUser(job.latitude, job.longitude)
      setLocation(distance)
      setJobStatus(job.status)
      const userData = localStorage.getItem('user')
      if(!userData){
          localStorage.setItem('redirectAfterLogin', `/job/${job.slug}`)
          router.push('/login')
          return
        }
      const user = JSON.parse(userData)
      setUser(user)
      if(job.status == 'accepted'){
        if(user.id != job.worker_id){
          router.push('/available_jobs')
        }
        setOpen(true)
      }
    }
    getLocation()
  }, [job.latitude, job.longitude])

  //handle accept job
  async function handleAcceptJob (){
    if(user?.role !== 'worker'){
      localStorage.setItem("redirectAfterLogin", pathName);
      setIsClient(true)
      return
    }

    try{
      setIsLoading(true)
      if(job.status == 'accepted'){
        return
      }
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accept_job?id=${job.id}&worker_id=${user.id}`, {method:"PATCH"})
      if(!data){
        console.log("Something went wrong try again")
        return
      }
      setOpen(true)
      router.refresh()
    }
    catch(e){
      console.log(e)
    }finally{
      setIsLoading(false)
    }
  }
  //handle reject job
  async function handleRejectJob (){
    if(job.status == "done"){
      console.log("you can't delete job one it is done")
      return
    }
    try {
      setIsRejectingJob(true)
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reject_job?id=${job.id}&worker_id=${user?.id}`, {method:"PATCH"})
        if(!data.ok){
          console.log("something went wrong")
          return
        }
        router.push('/available_jobs')
    } catch (error) {
      console.log(error)
    }finally{
      setIsRejectingJob(false)
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8">
      {/* CLIENT INFO SECTION */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar + Name + Distance */}
          <div className="flex items-start gap-5 lg:w-80 shrink-0">
            <div
              onClick={() => openImage(job.client_photo)}
              className="relative shrink-0 cursor-pointer"
            >
              <img
                src={job.client_photo}
                alt={job.client_fullname}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-800"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white dark:ring-gray-900" />
            </div>

            <div className="pt-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {job.client_fullname}
              </h2>

              <div className="flex items-center gap-1.5 mt-2 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-4 h-4" /> {location && location} km
                {/* <span className="font-medium">• {checkJobLocation(job.latitude, job.longitude)} km near you</span> */}
              </div>
              <p>{formatDate(job.created_at)}</p>
              <Link
                href={`/profile/${job.client_slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View full profile →
              </Link>
            </div>
          </div>

          {/* Middle: Contact & Job Meta */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 border-l border-gray-100 dark:border-gray-800 pl-8 lg:pl-12">
            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CONTACT NUMBER</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {job.client_contact}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SCHEDULED TIME</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {job.scheduled_date} • {job.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Amount */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">LOCATION</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5 leading-tight">
                    {job.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">QUOTED AMOUNT</p>
                  <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₦{job.quote_amount
                      ? Number(job.quote_amount).toLocaleString('en-US')
                      : 'Negotiable'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className=" shrink-0 pt-2">
            <div className="space-y-3">
              {
                jobStatus == 'pending' ?
              <button 
                onClick={handleAcceptJob}
                disabled={isLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-800 transition-all text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                <MessageCircle className="w-5 h-5" />
                 {isLoading ? 
                  <div className="
                  h-10 w-10 
                  rounded-full 
                  border-4 border-gray-300 
                  border-t-blue-600 
                  dark:border-gray-600 dark:border-t-blue-400
                  animate-spin
                " /> :"Accept & Start Chat"
                } 
              </button>:
                <button
                  onClick={()=>router.push('/request_service/inbox/message')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-800 transition-all text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  Chat
                </button>
              }

              {user?.id == job.worker_id ? 
                <button 
                  onClick={handleRejectJob}
                  className="w-full py-4 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 font-medium rounded-2xl transition-all">
                 {isRejectingJob ? 
                 <div className="
                  h-10 w-10 
                  rounded-full 
                  border-4 border-gray-300 
                  border-t-red-600 
                  dark:border-gray-600 dark:border-t-red-400
                  animate-spin
                " /> 
                 : "Decline Job"}
              </button>:
              ''
             }
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              You can negotiate price after accepting
            </p>
          </div>
        </div>
      </div>

      {/* JOB DETAILS & PHOTOS */}
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            {job.job_title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            {job.service_type}
          </p>

          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Job Photos */}
        {job.job_photos?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Job Photos ({job.job_photos.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {job.job_photos.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => openImage(img)}
                  className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Job photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
      <ContactPopup
        info={job}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
      <ImageViewer image={image} onClose={closeImage} />
      <ProAccountPopup open={isClient} onClose={() => setOpen(false)} />
    </div>
  );
}