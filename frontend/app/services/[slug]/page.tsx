import Footer from "@/app/component/footer";
import Head from "@/app/component/head";
import ServiceList from "@/app/service/service";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "Explore and hire Services - FixIt Platform",
  description:
    "Discover top-rated local professionals for plumbing, electrical, carpentry, and more near you",
};

type Services = {
  id: string;
  fullname: string;
  slug: string;
  profession: string;
  skills: string;
  coverphoto: string;
  profilephoto: string;
  rating: number;
  reviews: number;
  description: string;
  latitude: number;
  longitude: number;
  services: string[];
};

async function getWorkers(category: string): Promise<Services[]> {
  try {
    const response = await fetch(
      `${serverUrl}/api/workers/${category}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch workers:", response.status);
      return [];
    }

    const data = await response.json();

    return data.workers || data;

  } catch (error) {
    console.log("Server error:", error);
    return [];
  }
}

export default async function Service({
  params,
}: {
  params: { slug: string };
}) {
    const { slug } = await params;
    const workers = await getWorkers(slug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head />

      <div className="h-16" />

      <ServiceList displayedPros={workers} />

      <Footer />
    </div>
  );
}