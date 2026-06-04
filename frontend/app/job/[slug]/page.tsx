import { redirect } from 'next/navigation';
import Head from "@/app/component/head";
import Footer from "@/app/component/footer";

import { Metadata } from 'next'; // ✅ only once
import AvailableJob from './availableJob';

type Job = {
  id: number;
  client_photo: string;
  client_fullname: string;
  client_contact: string;
  scheduled_date: string;
  address: string;
  client_slug: string;
  job_title: string;
  service_type: string;
  description: string;
  job_photos: string[];
  slug: string;
  status: string;
  time: string;
  quote_amount: string; // kept as string (common from API)
  latitude: number;
  longitude: number;
  created_at:string
  worker_id:string  
  client_id:number
};
// 1. Notice that params is now a Promise of the type
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {

  // 2. Await the params object itself
  const { slug } = await params;
   
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/job_request?slug=${slug}`,
    { cache: 'no-store' }
  );
    if (!res.ok) {

    return {
      title: "Job not found",
      description: "This job does not exist",
    };
  }

  const job = await res.json();
  const image = job.job_photos?.[0] || "/default-job.jpg";

  return {
    title: `${job.job_title} ${job.status === "pending" ? "|  Job Available" : "Not Available"}`,
    description: job.description,
    openGraph: {
      title: job.job_title,
      description: job.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${job.slug}`,
      siteName: "Your Site Name",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: job.job_title,
      description: job.description,
      images: [image],
    },
  };
  // ... rest of your code
}

async function getAvailableJob(slug: string): Promise<Job> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/job_request?slug=${slug}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    redirect('/');
  }

  return response.json();
}

async function JobPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // ✅ FIXED
  const job = await getAvailableJob(slug);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading job request...
          </p>
        </div>
      </div>
    );
  }

  const jobStructuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.job_title,
    description: job.description,
    datePosted: job.scheduled_date,
    employmentType: job.service_type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.client_fullname,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.address,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: job.latitude,
        longitude: job.longitude,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "NGN",
      value: {
        "@type": "QuantitativeValue",
        value: job.quote_amount,
        unitText: "MONTH",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobStructuredData),
        }}
      />

      <Head />

      <div className="h-14" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
        <AvailableJob job={job} />
        <Footer />
      </div>
    </>
  );
}

export default JobPage;