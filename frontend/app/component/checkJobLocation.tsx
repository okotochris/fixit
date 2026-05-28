export default async function getDistanceFromUser(
  jobLat: number,
  jobLng: number
): Promise<number> {
  const getUserLocation = () =>
    new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 mins cache
        }
      );
    });

  let userLat: number;
  let userLng: number;

  const stored = localStorage.getItem("location");
  if (stored) {
    const parsed = JSON.parse(stored);
    userLat = parsed.lat;
    userLng = parsed.lng;
    console.log("localStorage", userLat, userLng)
    console.log("Job", jobLat, jobLng)
  } else {
    const loc = await getUserLocation();
    userLat = loc.lat;
    userLng = loc.lng;

    localStorage.setItem("location", JSON.stringify(loc));
  }

  // Convert degrees to radians
  const toRad = (value: number) => (value * Math.PI) / 180;

  // Earth's radius in KM
  const R = 6371;

  const dLat = toRad(jobLat - userLat);
  const dLng = toRad(jobLng - userLng);

  const lat1 = toRad(userLat);
  const lat2 = toRad(jobLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return Number(distance.toFixed(2)); // precise km
}