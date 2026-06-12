"use client";

import getLocation from '@/app/component/getUserLocation';
import FancyLoader from '@/app/component/loading';
import ServiceList from '@/app/service/service';
import React, { useEffect, useState } from 'react';

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
};

function Worker({ category }: { category: string }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNearbyWorkers() {
      setLoading(true);
      setError(null);

      try {
        // 1. Get user location
        let loc;

        const savedLocation = localStorage.getItem("location");

        if (savedLocation) {
          loc = JSON.parse(savedLocation);
        } else {
          loc = await getLocation();   // ← Important: await it

          if (loc) {
            localStorage.setItem("location", JSON.stringify(loc));
          }
        }

        if (!loc || !loc.lat || !loc.lng) {
          throw new Error("Could not get location");
        }

        // 2. Fetch nearby workers from API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/workers/${category}/nearby`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: loc.lat,
              longitude: loc.lng,
              limit: 50,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setWorkers(data.workers);

      } catch (err) {
       console.log(err)
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyWorkers();
  }, [category]);

  if (loading) {
    return  <FancyLoader fullScreen message={`Fetching ${category} near you...`} />;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return <ServiceList displayedPros={workers} />;
}

export default Worker;