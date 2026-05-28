'use client';

import { useEffect } from "react";
import getLocation from "../getUserLocation";
import { getDistance } from "./getDistance";

export default function useLocationSync(
  updateDBLocation: (loc: { lat: number; lng: number }) => Promise<any>
) {
  useEffect(() => {
    let isRunning = true;

    async function sync() {
      try {
        const newLoc = await getLocation();
        if (!isRunning || !newLoc) return; // ✅ FIX 1 (critical)
        const {accuracy} = newLoc;
        if(accuracy > 500){
          console.log('wrong accuracy')
          return;
        }
        const oldLoc = localStorage.getItem("location");

        if (!oldLoc) {
          localStorage.setItem("location", JSON.stringify(newLoc));
          await updateDBLocation(newLoc);
          return;
        }

        const parsedOld = JSON.parse(oldLoc);

        const distance = getDistance(
          parsedOld.lat,
          parsedOld.lng,
          newLoc.lat,
          newLoc.lng
        );

        if (distance > 0.5) {
          localStorage.setItem("location", JSON.stringify(newLoc));
          await updateDBLocation(newLoc);
        }
      } catch (err) {
        console.log(err);
      }
    }

    sync();

    return () => {
      isRunning = false;
    };
  }, [updateDBLocation]);
}