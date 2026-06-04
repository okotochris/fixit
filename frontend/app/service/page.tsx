import Footer from "../component/footer";
import Head from "../component/head";
import ServiceList from "./service";
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
  try {
    const response = await fetch(`${serverUrl}/api/get-workers`, { next: { revalidate: 60 } });

    if (!response.ok) {
      console.log("Failed to fetch workers:", response.status);
      return [];
    }

    const data = await response.json();

    // if API returns { workers: [...] }
    if (data.workers) {
      return data.workers;
    }

    // if API returns array directly
    return data;
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