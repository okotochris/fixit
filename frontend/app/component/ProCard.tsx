'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import getDistanceFromUser from "./checkJobLocation";

type Professional = {
  id:string
  fullname: string;
  profilephoto: string;
  slug: string;
  skills: string;
  rating: number;
  reviews: number;
  services:string[]
  latitude: number;
  longitude: number;
  coverphoto: string;
  description: string;
  profession:string
};
function ProCard({ pro, requestService }: { pro: Professional; requestService: (pro: Professional) => void }) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDistance() {
      console.log(pro)
      try {
        const result = await getDistanceFromUser(pro.latitude, pro.longitude);
        if (mounted) setDistance(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDistance();

    return () => {
      mounted = false;
    };
  }, [pro.latitude, pro.longitude]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      
      <div className="relative">
        <img
          src={pro.coverphoto || 'https://placehold.co/600x400?text=No+Image'}
          alt={`${pro.fullname} cover`}
          className="w-full h-48 object-cover"
        />
        <img
          src={pro.profilephoto || 'https://placehold.co/300x300?text=Profile'}
          alt={pro.fullname}
          className="absolute w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 -bottom-10 left-1/2 -translate-x-1/2 object-cover"

        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
          {distance !== null ? `${distance} km` : "Calculating..."} near you
        </div>
      </div>

      <div className="pt-14  px-6 flex flex-col grow text-center">
        <h3 className="text-xl font-semibold mb-1 dark:text-white">
          {pro.fullname}
        </h3>

        <p >
          {pro.skills} •{" "}  ★ {pro.rating} ({pro.reviews} reviews)
          
        </p>

        {/* ✅ Rating restored
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          ★ {pro.rating} ({pro.reviews} reviews)
        </p> */}

        {/* ✅ Description restored */}
        <p className="truncate text-gray-600 dark:text-gray-300 text-center text-sm line-clamp-3 mb-6 flex-grow">
          {pro.description}
        </p>
      </div>
      {/* ✅ Buttons restored */}
       <div className="flex gap-3 mb-1.5 mx-1.5 justify-center">
          <Link
            href={`/profile/${pro.slug}`}
            className="flex-1 text-center py-2.5 px-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
          >
            View Profile
          </Link>

          <button
            onClick={() => requestService(pro)}
            className="flex-1 py-2.5 px-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Request Service
          </button>
        </div>
    </div>
  );
}

export default ProCard;