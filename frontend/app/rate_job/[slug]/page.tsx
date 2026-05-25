'use client'
import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import FancyLoader from '@/app/component/loading'
import Link from 'next/link'
import MessageModal from '@/app/component/messageModal'
import it from 'react-phone-number-input/locale/it'

type Job = {
  id: number,
  client_photo: string,
  job_title: string,
  description: string,
  worker_fullname: string,
  worker_profilephoto: string,
  worker_slug: string
}

function Rating() {
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [jobData, setJobData] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const pathName = usePathname()
  const router = useRouter()

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
       //Save current path for redirect after login
      localStorage.setItem("redirectAfterLogin", pathName);
      router.push("/login");
      return;

    }
  const user = JSON.parse(storedUser);
  //GET JOB DETAILS USING SLUG
  const slug = pathName.split('/').pop();
  async function fetchJobDetails() {
    setLoading(true);
  try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job_info?slug=${slug}&&client_id=${user.id}`, {
      cache: 'no-store'
    });
    if(!result.ok){
      setMessage("Only the client who requested this service can rate it.")
      setIsOpen(true)
      return;
    }
    const jobDetails = await result.json();
    setJobData(jobDetails);
  } catch (error) {
    console.error('Error fetching job details:', error);
    setMessage("An error occurred while fetching job details. Please try again later.")
    setIsOpen(true)
  }finally{
    localStorage.removeItem("redirectAfterLogin");
    setLoading(false);
  }
  }
   fetchJobDetails()
  }, [])
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        
        {/* Overall Rating Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
            Customer Reviews
          </h2>
          
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {jobData?.job_title}
            </p>

            <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400 truncate">
              {jobData?.description}
            </p>
          </div>

          {/* Worker Info */}
          <Link href={`/profile/${jobData?.worker_slug}`} className="flex items-center gap-4 shrink-0 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4">
            <div className="flex items-center gap-4 shrink-0 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4">

              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/10">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700">
                  <img
                    src={jobData?.worker_profilephoto}
                    alt={jobData?.worker_fullname}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Assigned Worker
                  </p>

                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {jobData?.worker_fullname}
                  </p>
                </div>

              </div>
            </div>
          </Link>
        </div>
        </div>


        {/* Review Submission Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Share Your Experience
          </h3>

          {/* Star Rating */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-4">
              Your Rating
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setUserRating(rating)}
                  className="transition-all hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      (hoveredRating || userRating) >= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-zinc-700 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {userRating > 0 && (
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-3">
                You rated: <span className="font-medium text-gray-900 dark:text-white">
                  {ratingLabels[userRating]}
                </span>
              </p>
            )}
          </div>

          {/* Review Textarea */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-3">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this professional..."
              maxLength={500}
              rows={5}
              className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-2xl p-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
            />
            <p className="text-right text-xs text-gray-500 dark:text-zinc-500 mt-2">
              {reviewText.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <button
            disabled={userRating === 0 || reviewText.trim().length === 0}
            className="w-full py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-zinc-700 dark:disabled:to-zinc-700 text-white font-semibold rounded-2xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Submit Your Review
          </button>
        </div>

      <MessageModal message={message} onClose={()=>router.push('/service')} isOpen={isOpen} />
      </div>
        {loading && <FancyLoader fullScreen message="gathering job details..." />}
    </div>
  )
}

export default Rating