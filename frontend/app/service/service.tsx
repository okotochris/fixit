'use client'
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react"
import ProCard from "../component/ProCard";


type Services = {
  id: string;
  fullname: string;
  slug: string;
  profession: string;
  skills: string;
  coverphoto: string;
  profilephoto:string
  rating: number;
  reviews: number;
  description: string;
  latitude: number;
  longitude: number;
  services:string[]
}

function ServiceList({ displayedPros }: { displayedPros: Services[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("best-match")

  const filteredAndSortedPros = useMemo(() => {
    let result = [...displayedPros]

    // Search filter
   if (searchTerm.trim()) {
  const term = searchTerm.toLowerCase().trim();

  result = result.filter((pro) => {
    const fullname = (pro.fullname || "").toLowerCase();
    const profession = (pro.profession || "").toLowerCase();
    const description = (pro.description || "").toLowerCase();

    return (
      fullname.includes(term) ||
      profession.includes(term) ||
      description.includes(term)
    );
  });
}

    // Sorting
    switch (sortOption) {
      case "highest-rated":
        result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
        break
      case "most-reviews":
        result.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)
        break
      case "profession-az":
        result.sort((a, b) => a.profession.localeCompare(b.profession))
        break
      case "closest":
        result.sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude)
        break
      case "best-match":
      default:
        result.sort((a, b) => {
          const scoreA = a.rating * Math.log(a.reviews + 1)
          const scoreB = b.rating * Math.log(b.reviews + 1)
          return scoreB - scoreA
        })
        break
    }

    return result
  }, [displayedPros, searchTerm, sortOption])

  function requestService(data:Services){
    localStorage.setItem('worker', JSON.stringify(data));
      const user = localStorage.getItem('user')
      if(!user){
        localStorage.setItem('redirectAfterLogin', '/request_service')
        router.push('/login')
        return
      }
    router.push('/request_service')
  }
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight dark:text-white">
          Top Rated Pros Near You
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Find trusted local professionals — sorted your way.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:w-3/5 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, profession, or skill..."
            className="w-full pl-12 pr-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-auto min-w-[200px]">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full py-3.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition text-gray-900 dark:text-gray-100 appearance-none"
          >
            <option value="best-match">Best Match</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="most-reviews">Most Reviews</option>
            <option value="closest">Closest First</option>
            <option value="profession-az">Profession A–Z</option>
          </select>
        </div>
      </div>

      {filteredAndSortedPros.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No professionals found. Try different keywords or adjust filters!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
           {filteredAndSortedPros.map((pro) => (
          <ProCard
            key={pro.slug}
            pro={pro}
            requestService={requestService}
          />
        ))}
        </div>
      )}
    </div>
  )
}

export default ServiceList