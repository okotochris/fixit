export default async function getGeoFromIP(ip: string) {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);

    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (!data.success) {
      throw new Error("Geo lookup failed");
    }

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