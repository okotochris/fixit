'use client';
import { Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from "next/navigation";
import { useImageViewer } from '../../component/useImageView'
import { ImageViewer } from "../../component/imageViewer";
import getDistanceFromUser from '../../component/checkJobLocation';
import BrandSocialShare from '../../component/shareButton';

type User = {
  id: string;
  fullname: string;
  email: string;
  profilePix?: string;
  role: string;
  location: string;
  address: string;
  image: string[]
  description: string;
  coverphoto: string;
  profilephoto: string;
  skills: string;
  services: string[]
  latitude:number
  longitude:number
  slug:string
};
type Job = {
  id:string,
  service_type:string
  job_title:string,
  description:string,
  scheduled_date:string,
  job_photos:string[]
  quote_amount:string,
  slug:string,
  status:string
  created_at:string,
  quote_status:string

}

function Userprofile({ user }: { user: User }) {
 
  const [location, setLocation] = useState<number | null>(null)
  const { image, openImage, closeImage } = useImageViewer();
  const [oepnShare, setOpenShare] = useState(false)
  const router = useRouter()
  const targetRef = useRef(null)



  function requestJob() {
    const currentUser = localStorage.getItem("user");
    localStorage.setItem('worker', JSON.stringify(user))
    if (!currentUser) {
      localStorage.setItem("redirectAfterLogin", 'request_service');
      router.push("/login");
      return;
    }
 
    router.push('/request_service')
  }
 useEffect(() => {
  let mounted = true;

  getDistanceFromUser(user.latitude, user.longitude)
    .then((result) => {
      if (mounted) {
        setLocation(result);
      }
    })
    .catch((err) => console.log(err));

  return () => {
    mounted = false;
  };
  
}, [user.latitude, user.longitude]);

return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover Photo */}
      <div 
        className="h-64 md:h-80 w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${user.coverphoto || 'https://placehold.co/600x400?text=No+Image'})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Profile Info Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            
            {/* Avatar */}
            <div className="flex justify-center md:justify-start shrink-0">
              <div 
                 onClick={()=>openImage(user.profilephoto)}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-700">
               
                <img 
                  src={user.profilephoto || 'https://placehold.co/300x300?text=Profile'}
                  alt={user.fullname} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.fullname}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>

              <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                Professional {user.skills}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-xl">★</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">4.8</span>
                  <span>(120 reviews)</span>
                </div>
                <div className="hidden md:block text-gray-400 dark:text-gray-600">•</div>
                {/* <div>120 jobs completed</div> */}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}km away</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{user.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className="relative flex items-center justify-center md:justify-end gap-3 mt-4 md:mt-0">
              <button 
                onClick={()=>oepnShare ?setOpenShare(false):setOpenShare(true) } 
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition border border-gray-300 dark:border-gray-700">
                <Share2 size={18} />
                Share
              </button>
              <button 
                onClick={requestJob}
                className="flex items-center gap-2 px-6 py-2.5 text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 font-medium rounded-lg transition shadow-md"
              >
                Request Job
              </button>
              {oepnShare && <div className='absolute -top-16 md:top-14 right-0'>
                <BrandSocialShare slug={user?.slug || ""} />
              </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{user.description || "No content yet"}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Services Offered</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user.services && user.services.length > 0 ? user.services.map((service, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center font-medium text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-sm hover:shadow"
              >
                {service}
              </div>
            ))
          :"No service added"
            }
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Gallery</h2>
          <div 
            ref={targetRef}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {user.image && user.image.length > 0 ? user.image.map((img, i) => (
              <div 
                key={i} 
                className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-pointer group"
                onClick={() => openImage(img)}
              >
                <img 
                  src={img} 
                  alt={`Project ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )):"No image"}
          </div>  
        </section>

        {/* Reviews Section */}
        {/* <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Client Reviews</h2>

          <div className="space-y-5">
            {[
              {
                name: "Sarah M.",
                initial: "S",
                rating: 5,
                date: "2 weeks ago",
                comment: "Mike was fantastic! He arrived on time, diagnosed the issue quickly, and fixed our leaking pipe in no time. Highly recommend!"
              },
              {
                name: "David L.",
                initial: "D",
                rating: 4,
                date: "1 month ago",
                comment: "Great service overall. Mike was professional and knowledgeable. The only reason I'm giving 4 stars instead of 5 is because of a slight delay in communication."
              },
            ].map((review, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{review.initial}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{review.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <svg
                          key={j}
                          className={`w-5 h-5 ${
                            j < review.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.47 4.521h4.752c.978 0 1.374 1.24.588 1.81l-3.847 2.782 1.47 4.521c.3.922-.755 1.688-1.54 1.118l-3.847-2.782-3.847 2.782c-.784.57-1.838-.196-1.54-1.118l1.47-4.521-3.847-2.782c-.786-.57-.39-1.81.588-1.81h4.752l1.47-4.521z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition border border-gray-300 dark:border-gray-700">
            Load More Reviews
          </button>
        </section> */}

  
        <ImageViewer image={image} onClose={closeImage} />
      </div>
    </div>
  )
}

export default Userprofile