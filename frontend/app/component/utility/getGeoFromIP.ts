async function getGeoFromIP(ip: string) {
  try {
    // 1. Try ipapi
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();

    if (!data.latitude) throw new Error("ipapi failed");

    return data;
  } catch (e) {
    try {
      // 2. fallback ipinfo
      const res = await fetch(`https://ipinfo.io/${ip}/json?token=YOUR_TOKEN`);
      const data = await res.json();

      const [lat, lng] = data.loc.split(",");

      return {
        latitude: lat,
        longitude: lng,
      };
    } catch (e2) {
      // 3. final fallback (no geo)
      return {
        latitude: null,
        longitude: null,
      };
    }
  }
}
export default getGeoFromIP;