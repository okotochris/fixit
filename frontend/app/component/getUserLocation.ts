/**
 * Optimized for Worker Apps: Compares all retries and returns 
 * the mathematically most accurate coordinate found.
 */
const getLocation = (
  maxRetries = 2,
  targetAccuracy = 100
): Promise<{ lat: number; lng: number; accuracy: number } | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return resolve(null);
    }

    let attempts = 0;
    let bestResult: { lat: number; lng: number; accuracy: number } | null = null;

    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const currentData = { lat: latitude, lng: longitude, accuracy };

          // Update bestResult if this is the first result OR more accurate than the previous best
          if (!bestResult || accuracy < bestResult.accuracy) {
            bestResult = currentData;
          }


          // 1. If "Perfect" accuracy is hit -> Resolve immediately
          if (accuracy <= targetAccuracy) {

            return resolve(currentData);
          }

          // 2. If not perfect, handle retries
          attempts++;

          if (attempts < maxRetries) {

            setTimeout(tryGetLocation, 1500); 
          } else {
            // 3. All retries exhausted -> Return the absolute best one we found

            resolve(bestResult);
          }
        },
        (err) => {
          console.error("Geolocation Error:", err.message);
          // If we already have a partial result from a previous attempt, return it.
          // Otherwise, return null.
          resolve(bestResult);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    tryGetLocation();
  });

export default getLocation;