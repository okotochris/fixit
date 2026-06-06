import { headers } from "next/dist/server/request/headers";
import Footer from "../component/footer";
import Head from "../component/head";
import ServiceList from "./service";
import getGeoFromIP from "../component/utility/getGeoFromIP";
const serverUrl = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "Explore and hire Services - serviceHub Platform",
  description:
    "Discover top-rated local professionals for plumbing, electrical, carpentry, and more.. near you",
};



type Services  = {
  id: string;
  fullname: string;
  slug: string;
  profession: string;
  skills: string;
  coverphoto: string;
  profilephoto:string
  rating: number;
  reviews: number;
  description: string;
  latitude: number;
  longitude: number;
  services:string[]
};

async function getWorkers(): Promise<Services[]> {
  const headersList = await headers();

  const ipRaw =
    headersList.get("x-forwarded-for") ||
    headersList.get("cf-connecting-ip") ||
    "127.0.0.1";

  const ip = ipRaw.split(",")[0].trim();

  const geo = await getGeoFromIP(ip);

  console.log("User IP:", ip, "Geo:", geo);

  let page = 1;
  const limit = 20;

  try {
    const response = await fetch(
      `${serverUrl}/api/get-workers?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            lat: geo.latitude,
            lng: geo.longitude,
          },
          radius: 20,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch workers:", response.status);
      return [];
    }

    const data = await response.json();
    page = data.nextPage || page++
    return data.workers`` || data;
  } catch (error) {
    console.log("Server error:", error);
    return [];
  }
}

export default async function Service() {
  const workers = await getWorkers();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head />
      <div className="h-16" />
      <ServiceList displayedPros={workers} />
      <Footer />
    </div>
  );
}