import { Calendar, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import getDistanceFromUser from './checkJobLocation';
import { formatDate } from './formatDate';

interface Job {
  id: number;
  job_title: string;
  service_type: string;
  description: string;
  scheduled_date: string;
  address: string;
  quote_amount: number | null;
  job_photos: string[];
  slug: string;
  status: string;
  created_at: string;
  latitude:number,
  longitude:number
  skills:string
}

function JobCard({job, i}:{job:Job, i:number}) {
    const [location, setLocation] = useState(0)
    useEffect(()=>{
       async function  getLocation(){
           const distance = await  getDistanceFromUser(job.latitude, job.longitude)
           setLocation(distance)
        }
        getLocation()
    }, [job.longitude, job.latitude])
        return (
             <Link
                key={i}
                href={`/job/${job.slug}`}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
              >
                {/* Job Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {job.job_photos?.length > 0 ? (
                    <img
                      src={job.job_photos[0]}
                      alt={job.job_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No photo available
                    </div>
                  )}

                  <div className="absolute top-0 right-4">
                    <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-blue-700 text-white text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                     {location && location} km
                  </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.job_title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">
                    {job.service_type}
                  </p>

                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {job.description?.length > 100 ? job.description.slice(0, 100) + '...' : job.description}
                  </p>

                  <div className="mt-6 space-y-2.5 text-sm">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{job.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(job.created_at) }</span>
                    </div>

                    {job.quote_amount && (
                      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        <DollarSign className="w-4 h-4" />
                        ₦{job.quote_amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
  )
}

export default JobCard
