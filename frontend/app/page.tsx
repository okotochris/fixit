export const dynamic = "force-dynamic";
import Head from './component/head'
import { Metadata } from 'next'
import { Search } from 'lucide-react'
import Footer from './component/footer'
import Jobs from './component/jobs'
import Link from 'next/link';
import Hero from './component/hero';
const serverUrl = process.env.NEXT_PUBLIC_API_URL ?? "";


export const metadata: Metadata = {
  title: "FixIt - Find Skilled Workers Near You",
  description: "Connect with plumbers, painters, cleaners,  electricians, carpenters and more.",
}
type Worker={
  id: string;
  fullname: string;
  slug: string;
  profession: string;
  coverphoto: string;
  profilephoto:string
  rating: number;
  reviews: number;
  description: string;
  location: string;
  address: number,
  latitude: number;
  longitude: number;
  services:string[]
  skills:string
}
async function getWorkers(): Promise<Worker[]> {
  let page = 1;
  const limit = 10;

  try {
    const response = await fetch(`${serverUrl}/api/get-workers?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.log("Failed to fetch workers:", response.status);
      return [];
    }

    const data = await response.json();
    page = data.page;

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
export default async function Home() {
  const proffesion = [
    { item: "Plumber", icon: "/plumbing.png" },
    { item: "Electrician", icon: "/electrical.png" },
    { item: "Carpenter", icon: "/carpentry.png" },
    { item:'Funiture', icon: "/carpentry.png" },
    { item: "Painter", icon: "/painting.png" },
    { item: "HVAC Technician", icon: "/hvac.png" },
    { item: "Cleaner", icon: "/cleaning.png" },
    { item: "Gardener", icon: "/gardening.png" },
    { item: "Welder", icon: "/welding.png" },
    { item: "Baber", icon: "/babing.png" }
  ]

  const how_it_works = [
    { step: 1, title: "Search", description: "Browse through thousands of rated professionals for any service you need." },
    { step: 2, title: "Connect", description: "Chat directly with pros, discuss your project details, and get estimates." },
    { step: 3, title: "Hire", description: "Choose the best pro for your budget and schedule securely through FixIt." },
    { step: 4, title: "Rate", description: "Mark the job complete and leave a review to help the community." }
  ]
  const pros = await getWorkers();
  

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Head />
      <div className="h-14" />
      <Hero/>
      <main className="w-[80%] mx-auto">
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Explore Categories</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Find the right professional for your home repair needs.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {proffesion.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-2 md:p-5 rounded-xl shadow hover:shadow-lg transition  text-center border border-gray-200 dark:border-gray-700"
              >
              <Link href={`/services/${item.item}`}>
                <img src={item.icon} alt={item.item} className="mx-auto mb-4" width={64} height={64} />
                <h3 className="text-sm md:text-lg font-semibold dark:text-white">{item.item}</h3>
              </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    <Jobs pros = {pros}/>
      <div className="bg-[#E8F3FF] dark:bg-gray-900/70 py-12">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Get your job done in 4 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {how_it_works.map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
              >
                <span className="bg-blue-600 dark:bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-900/50 py-12">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Why Choose FixIt?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Trusted professionals, transparent pricing, and quality service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Verified Professionals", desc: "All our professionals are background checked and verified for quality." },
              { title: "Transparent Pricing", desc: "Get upfront pricing with no hidden fees." },
              { title: "Satisfaction Guarantee", desc: "We stand behind our professionals with a satisfaction guarantee." }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}