export default async function getGeoFromIP(ip?: string) {
  if (!ip || 
      ip === "::1" || 
      ip.startsWith("127.") || 
      ip.startsWith("192.168.") || 
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") || 
      ip.startsWith("172.17.") || 
      ip.startsWith("172.18.") || 
      ip.startsWith("172.19.") ||
      ip.startsWith("172.2") || 
      ip.startsWith("172.3")) {
    return { latitude: null, longitude: null, city: null, country: null };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: controller.signal,
      next: { revalidate: 1800 }, // cache 30 minutes
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (data.success && data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_code || data.country,
      };
    }
  } catch (err) {
    console.warn("IP Geolocation failed:", err);
  }

  return { latitude: null, longitude: null, city: null, country: null };
}