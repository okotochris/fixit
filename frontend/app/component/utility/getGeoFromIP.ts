export default async function getGeoFromIP(ip: string) {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();

    if (!data.success) throw new Error("Geo failed");

    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (err) {
    console.log("Geo lookup failed:", err);

    return {
      latitude: null,
      longitude: null,
    };
  }
}