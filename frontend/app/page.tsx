export const dynamic = "force-dynamic";
import Head from './component/head'
import { Metadata } from 'next'
import Footer from './component/footer'
import Jobs from './component/jobs'
import Link from 'next/link';
import Hero from './component/hero';
import getGeoFromIP from './component/utility/getGeoFromIP'
import { headers } from "next/headers";
import { Shield } from 'lucide-react';
const serverUrl = process.env.NEXT_PUBLIC_API_URL ?? "";


export const metadata: Metadata = {
  title: "serviceHub - Find Skilled Workers Near You",
  description: "Connect with plumbers, painters, cleaners,  electricians, carpenters and more.",
}


async function getWorkers(): Promise<Worker[]> {
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
    return data.workers || data;
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
    { item: 'Furniture', icon: "/carpentry.png" },
    { item: "Roofer", icon: "/roof.png" },
    { item: "HVAC", icon: "/hvac.png" },
    { item: "Cleaner", icon: "/cleaning.png" },
    { item: "Welder", icon: "/welder.png" },
    { item: "Barber", icon: "/barber.png" },
    { item: "Fumigator", icon: "/fumigation.png" },
    { item: "Hair stylist ", icon: "/hvac.png" },
    { item: "Tailor", icon: "/barber.png" },
    { item: "Hair dresser", icon: "/hvac.png" },
    { item: "Handyman", icon: "/handyman.png" },
    { item: "Mechanic", icon: "/mechanic.png" },
    { item: "Painter", icon: "/painting.png" },
    { item: "POP", icon: "/painting.png" },
    { item: "Fabricator", icon: "/handyman.png" },
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
      <Hero />
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



      {/* // CLLING Display professionals WITH LOCOATION  Jobs*/}
      {/* <Jobs pros = {pros}/> */}
      <div className="bg-[#E8F3FF] dark:bg-gray-900/70 py-12">

        {/* HIRE A SUPERVISOR */}
      <div className="group w-[95%] md:w-[50%] my-5 mx-auto flex flex-col items-center bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-orange-400">

          {/* ICON */}
          <span className="bg-orange-500 group-hover:bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition">
              
              <Shield className="w-7 h-7"/>
             
          </span>

          {/* TITLE */}
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              HIRE A PROJECT SUPERVISOR
          </h3>

          {/* DESCRIPTION */}
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed mb-5">
              Living abroad but managing a project back home or you need someone to over see it?
              Get a reliable project supervisor to monitor your work,
              oversee activities and keep you updated while you are away.
          </p>

          {/* PROJECT TYPES */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
              {['Houses', 'Offices', 'Hotels', 'Hospitals', 'Other Projects'].map((item) => (
                  <span
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 text-xs font-medium"
                  >
                      {item}
                  </span>
              ))}
          </div>

          {/* CTA */}
          <Link
              href="/contact-supervisor"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all text-center"
          >
              Contact Us to Hire a Supervisor
          </Link>

          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Manage your project from anywhere in the world.
          </p>

      </div>
    
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