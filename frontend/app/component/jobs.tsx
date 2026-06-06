'use client'

import { useRouter } from "next/navigation";
import ProCard from "./ProCard";
import useLocationSync from "./utility/useLocationSync";
import { useCallback, useEffect, useState } from "react";
import { getDistance } from "./utility/getDistance";
import getLocation from "./getUserLocation";



// Better name: singular type for one item
type Professional = {
  id: string;
  fullname: string;
  slug: string;
  skills: string;
  coverphoto: string;
  profilephoto:string
  rating: number;
  reviews: number;
  description: string;
  latitude: number;
  longitude: number;
  services:string[]
   profession:string

};

// Use descriptive prop name + correct type
interface ProsListProps {
  pros: Professional[];
}
function ProsList({ pros }: ProsListProps) {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

 useEffect(() => {
  async function fetchLocation() {
    try {
      const storedLocation = localStorage.getItem("location");

      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
        return;
      }

      const loc = await getLocation();

      if (loc) {
        localStorage.setItem("location", JSON.stringify(loc));

        setLocation({
          lat: loc.lat,
          lng: loc.lng,
        });
      }
    } catch (err) {
      console.log("Failed to get user location:", err);
    }
  }

  fetchLocation();
}, []);
  
  function requestService(data: Professional) {

    localStorage.setItem("worker", JSON.stringify(data));
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.setItem("redirectAfterLogin", '/request_service');
      router.push("/login");
      return;
    }
    router.push("/request_service");
  }

 const updateDBLocation = useCallback(async (newLoc: { lat: number; lng: number }) => {
 
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) return;
  console.log('user location updated:', newLoc);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/update-location`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newLoc, id: user.id }),
    }
  );

  return res.json();
}, []);

  // 🔥 CLEAN: runs once automatically
  useLocationSync(updateDBLocation);

  //sort data
const sortedPros = [...pros]
  .map((pro) => ({
    ...pro,
     distance: getDistance(
      location?.lat || 0,
      location?.lng || 0,
      pro.latitude,
      pro.longitude
    ),
  }))
  .sort((a, b) => {
    // 1. distance (MOST IMPORTANT)
    const distanceDiff = a.distance - b.distance;
    if (distanceDiff !== 0) return distanceDiff;

    // 2. rating
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    if (ratingDiff !== 0) return ratingDiff;

    // 3. reviews
    const reviewDiff = (b.reviews || 0) - (a.reviews || 0);
    if (reviewDiff !== 0) return reviewDiff;

    // 4. stable fallback
    return a.fullname.localeCompare(b.fullname);
  });
  
  return (
    <div className="container mx-auto py-12 text-center px-4">
      <h2 className="text-3xl font-bold mb-4 dark:text-white">
        Top Rated Pros Near You
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        See the best professionals in your area based on ratings and reviews.
      </p>

      {sortedPros.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No professionals found in your area at the moment.
          </p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Try changing your location or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
        {sortedPros.map((pro) => (
          <ProCard
            key={pro.slug}
            pro={pro}
            requestService={requestService}
          />
        ))}
        </div>
      )}
    </div>
  );
}
export default ProsList;