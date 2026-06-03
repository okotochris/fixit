type LocationResult = {
  lat: number;
  lng: number;
  accuracy: number;
  source: "gps" | "denied";
};

const getLocation = (
  maxRetries = 3,
  targetAccuracy = 100
): Promise<LocationResult | null> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return resolve(null);
    }

    let attempts = 0;
    let bestResult: LocationResult | null = null;
    let hasResolved = false;

    const saveToCache = (loc: LocationResult) => {
      try {
        localStorage.setItem("location", JSON.stringify(loc));
      } catch {}
    };

    const finish = (loc: LocationResult | null) => {
      if (hasResolved) return;
      hasResolved = true;

      if (loc) saveToCache(loc);
      resolve(loc);
    };

    const tryGPS = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          const current: LocationResult = {
            lat: latitude,
            lng: longitude,
            accuracy,
            source: "gps",
          };

          // keep best accuracy
          if (!bestResult || accuracy < bestResult.accuracy) {
            bestResult = current;
          }

          // good enough → return immediately
          if (accuracy <= targetAccuracy) {
            return finish(current);
          }

          attempts++;

          if (attempts < maxRetries) {
            setTimeout(tryGPS, 1200);
          } else {
            // return best found GPS result
            return finish(bestResult);
          }
        },

        (err) => {
          console.warn("Location error:", err.code, err.message);

          // 🚨 USER DENIED / LOCATION OFF
          if (err.code === 1) {
            return finish({
              lat: 0,
              lng: 0,
              accuracy: 999999,
              source: "denied",
            });
          }

          // other errors → return best we have or null
          return finish(bestResult);
        },

        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    };

    tryGPS();
  });

export default getLocation;