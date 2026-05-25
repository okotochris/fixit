'use client'

import { useRouter } from "next/navigation";
import ProCard from "./ProCard";
import useLocationSync from "./utility/useLocationSync";


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

};

// Use descriptive prop name + correct type
interface ProsListProps {
  pros: Professional[];
}
function ProsList({ pros }: ProsListProps) {
  const router = useRouter();

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

  async function updateDBLocation(newLoc: { lat: number; lng: number }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/update-location`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLoc, id: user.id }),
      }
    );

    return res.json();
  }

  // 🔥 CLEAN: runs once automatically
  useLocationSync(updateDBLocation);

  return (
    <div className="container mx-auto py-12 text-center px-4">
      <h2 className="text-3xl font-bold mb-4 dark:text-white">
        Top Rated Pros Near You
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        See the best professionals in your area based on ratings and reviews.
      </p>

      {pros.length === 0 ? (
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
        {pros.map((pro) => (
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