import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Head from '@/app/component/head';
import Userprofile from '@/app/profile/[slug]/userProfile';

type User = {
  id: string;
  slug: string;
  fullname: string;
  email: string;
  profilePix?: string;
  role: string;
  location: string;
  address: string;
  image: string[];
  description: string;
  coverphoto: string;
  profilephoto: string;
  skills: string;
  services: string[];
  longitude: number;
  latitude: number;
};

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ Dynamic SEO (for social media + Google)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params; // ✅ FIXED (no await) 
  const res = await fetch(
    `${serverUrl}/api/get-user?slug=${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return {
      title: "Profile not found",
      description: "This user does not exist",
    };
  }

  const user = await res.json();
  const image = user.profilephoto || "/default-profile.jpg";

  return {
    title: `${user.fullname} | Profile`,
    description: user.description || `${user.fullname}'s profile`,

    openGraph: {
      title: user.fullname,
      description: user.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${slug}`,
      siteName: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
    },

    twitter: {
      card: "summary_large_image",
      title: user.fullname,
      description: user.description,
      images: [image],
    },
  };
}

// ✅ Fetch user
async function getUser(slug: string): Promise<User> {
  const response = await fetch(
    `${serverUrl}/api/get-user?slug=${slug}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    redirect('/');
  }

  return response.json();
}

// ✅ Page
export default async function Profile({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params; // ✅ FIXED (no await)
  const user = await getUser(slug);

  // ✅ Structured Data (Person Schema)
  const userStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.fullname,
    description: user.description,
    image: user.profilephoto,
    address: {
      "@type": "PostalAddress",
      addressLocality: user.location,
      streetAddress: user.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: user.latitude,
      longitude: user.longitude,
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${slug}`,
    knowsAbout: user.skills,
  };

  return (
    <>
      {/* ✅ SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(userStructuredData),
        }}
      />

      <div className="min-h-screen bg-white">
        <Head />
        <div className="h-14" />
        <Userprofile user={user} />
      </div>
    </>
  );
}