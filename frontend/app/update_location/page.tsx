"use client";

import { useEffect, useState } from "react";
import {MapContainer, TileLayer, Marker, useMapEvents,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Next.js
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MessageModal from "../component/messageModal";
import { useRouter } from "next/navigation";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type Location = {
  lat: number;
  lng: number;
  source: "gps" | "map";
};

function MapClickHandler({ onSelect }: any) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        source: "map",
      });
    },
  });

  return null;
}

export default function LocationPicker() {
  const [mode, setMode] = useState<
    "loading" | "gps" | "map" | "ready"
  >("loading");

  const [location, setLocation] = useState<Location | null>(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // -----------------------------
  // 1. Try GPS on mount
  // -----------------------------
  useEffect(() => {
    getUserLocation();
  }, []);

  function getUserLocation() {
    setMode("loading");

    if (!navigator.geolocation) {
      setMode("map");
      setMessage("Geolocation not supported. Please select on map.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: Location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: "gps",
        };

        setLocation(loc);
        setMode("gps");
      },
      () => {
        setMode("map");
        setMessage("We couldn't get your location. Please pick on map.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  // -----------------------------
  // 2. Save location
  // -----------------------------
  async function saveLocation() {
    if (!location) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Saving location for user:", user); 
    if(!user){
        localStorage.setItem("redirectAfterLogin", "/update_location");
       router.push("/login");
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

    if (!res.ok) {
      setMessage("Failed to save location");
      return;
    }

    setMode("ready");
    setMessage("Location saved successfully.");
    setIsOpen(true);
  }

  // -----------------------------
  // 3. UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">

        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Set Your Location
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-1">
          We use this to connect you with nearby jobs and workers.
        </p>

        {/* ---------------- GPS result ---------------- */}
        {mode === "gps" && location && (
          <div className="mt-5 space-y-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900 text-sm">
              ✔ GPS Location detected
              <div>
                Lat: {location.lat.toFixed(5)}
              </div>
              <div>
                Lng: {location.lng.toFixed(5)}
              </div>
            </div>

            <button
              onClick={saveLocation}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Save Location
            </button>

            <button
              onClick={() => setMode("map")}
              className="w-full text-sm text-gray-500"
            >
              Change location manually
            </button>
          </div>
        )}

        {/* ---------------- MAP MODE ---------------- */}
        {mode === "map" && (
          <div className="mt-5 space-y-3">

            <div className="h-[300px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[6.5244, 3.3792]} // Lagos default
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler
                  onSelect={(loc: Location) => setLocation(loc)}
                />

                {location && (
                  <Marker position={[location.lat, location.lng]} />
                )}
              </MapContainer>
            </div>

            {location && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Selected:
                <br />
                Lat: {location.lat.toFixed(5)} <br />
                Lng: {location.lng.toFixed(5)}
              </div>
            )}

            <button
              onClick={saveLocation}
              disabled={!location}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              Save Selected Location
            </button>

            <button
              onClick={getUserLocation}
              className="w-full text-sm text-gray-500"
            >
              Try GPS again
            </button>
          </div>
        )}

        {/* ---------------- LOADING ---------------- */}
        {mode === "loading" && (
          <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-300">
            Detecting your location...
          </div>
        )}

        {/* ---------------- DONE ---------------- */}
        {mode === "ready" && (
          <div className="mt-5 text-center text-green-600 text-sm">
            ✔ Location saved successfully
          </div>
        )}

        {/* ---------------- MESSAGE ---------------- */}
        {message && (
          <p className="mt-4 text-center text-xs text-gray-500">
            {message}
          </p>
        )}
      </div>
       <MessageModal message={message} onClose={()=>router.push('/profile')} isOpen={isOpen} />
    </div>
  );
}