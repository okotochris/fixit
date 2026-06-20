"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MessageModal from "../component/messageModal";
import { useRouter } from "next/navigation";
import FancyLoader from "../component/loading";

const LocationMap = dynamic(
  () => import("./locationMap"),
  {
    ssr: false,
    loading: () => (
      <FancyLoader fullScreen message="Searching for your location..." />
    ),
  }
);

type Location = {
  lat: number;
  lng: number;
  source: "gps" | "map";
};

export default function UpdateLocation() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<
    "loading" | "gps" | "map" | "ready"
  >("loading");

  const [location, setLocation] = useState<Location | null>(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUserLocation();
  }, []);

  function getUserLocation() {
    setMode("loading");
    setMessage("");

    if (!navigator.geolocation) {
      setMode("map");
      setMessage(
        "Location services are not supported on this device. Please select your location on the map."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: "gps",
        });

        setMode("gps");
      },
      () => {
        setMode("map");
        setMessage(
          "We couldn't access your location. Please select it on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  async function saveLocation() {
    if (!location) return;

    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
      if(!user){
        localStorage.setItem("redirectAfterLogin", '/login');
        router.push('/login');
        return;
      }
      const res = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/update-location`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...location, id: user.id }),
      }
    );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update location");
      }
      localStorage.setItem("location", JSON.stringify(location));
      localStorage.setItem("user", JSON.stringify({...user, latitude:location.lat, logitude:location.lng}))
      
      setMode("ready");
      setMessage("Location updated successfully.");
      setIsOpen(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update location.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Update Your Location
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
          We use your location to connect you with nearby jobs and workers.
        </p>

        {/* Loading */}
        {mode === "loading" && (
          <div className="mt-8 text-center text-gray-500 dark:text-gray-300">
            Detecting your location...
          </div>
        )}

        {/* GPS Success */}
        {mode === "gps" && location && (
          <div className="mt-6">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <p className="font-medium text-green-700 dark:text-green-300">
                ✓ Location detected
              </p>

              <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                Latitude: {location.lat.toFixed(5)}
              </p>

              <p className="text-sm text-green-600 dark:text-green-400">
                Longitude: {location.lng.toFixed(5)}
              </p>
            </div>

            <button
              onClick={saveLocation}
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              {loading ? "Saving..." : "Save Location"}
            </button>

            <button
              onClick={() => setMode("map")}
              className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400"
            >
              Choose location manually
            </button>
          </div>
        )}

        {/* Map Selection */}
        {mode === "map" && (
          <div className="mt-6 space-y-4">
            <LocationMap
              location={
                location
                  ? {
                      lat: location.lat,
                      lng: location.lng,
                    }
                  : null
              }
              onSelect={(loc) =>
                setLocation({
                  ...loc,
                  source: "map",
                })
              }
            />

            {location && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Selected Location
                <br />
                Lat: {location.lat.toFixed(5)}
                <br />
                Lng: {location.lng.toFixed(5)}
              </div>
            )}

            <button
              onClick={saveLocation}
              disabled={loading || !location}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
            >
              {loading ? "Saving..." : "Save Selected Location"}
            </button>

            <button
              onClick={getUserLocation}
              className="w-full text-sm text-gray-500 dark:text-gray-400"
            >
              Try GPS Again
            </button>
          </div>
        )}

        {/* Success */}
        {mode === "ready" && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-center">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✓ Location updated successfully
            </p>
          </div>
        )}

        {message && mode !== "ready" && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            {message}
          </div>
        )}
      </div>
       <MessageModal message={message} onClose={()=>router.push('/profile')} isOpen={isOpen} />
    </div>
  );
}