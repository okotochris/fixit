'use client';

import React, { useEffect, useState } from 'react';
import getLocation from '../component/getUserLocation';
import ServiceList from './service';
import FancyLoader from '../component/loading';

type Worker = {
  id: string;
  fullname: string;
  slug: string;
  skills: string;
  coverphoto: string;
  profilephoto: string;
  rating: number;
  reviews: number;
  description: string;
  latitude: number;
  longitude: number;
  services: string[];
  profession: string;
  distance?: number;   // Optional: if your API returns distance
};

function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkers() {
      setLoading(true);
      setError(null);

      try {
        // 1. Get user location
        let loc;

        const savedLocation = localStorage.getItem("location");

        if (savedLocation) {
          loc = JSON.parse(savedLocation);
        } else {
          loc = await getLocation();

          if (loc) {
            localStorage.setItem("location", JSON.stringify(loc));
          }
        }

        if (!loc?.lat || !loc?.lng) {
          throw new Error("Could not retrieve your location");
        }

        // 2. Fetch workers from API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-workers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: loc.lat,
              longitude: loc.lng,
              radius: 20,        // in km
              limit: 50,
            }),
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch workers: ${response.status}`);
        }

        const data = await response.json();

        setWorkers(data.workers || data || []);

      } catch (err) {
        console.error("Error fetching workers:", err);
        ;
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  // Loading State
  if (loading) {
    return (
       <FancyLoader fullScreen message={`Fetching workers near you...`} />
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <ServiceList displayedPros={workers} />;
}

export default Workers;