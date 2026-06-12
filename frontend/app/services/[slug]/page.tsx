import Footer from "@/app/component/footer";
import Head from "@/app/component/head";
import Worker from "./Worker";

// Dynamic Metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Format slug nicely (e.g., "plumbing-service" → "Plumbing Services")
  const serviceName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Hire ${serviceName} Near You | Best Local Professional workers - ServiceHub`,
    description: `Find and hire top-rated ${serviceName.toLowerCase()} experts in your area. Book reliable ${serviceName.toLowerCase()} & skilled workers with verified reviews and instant quotes.`,
    
    keywords: [
      serviceName,
      `${serviceName} near me`,
      `hire ${serviceName}`,
      `best ${serviceName} services`,
      "local professionals",
      "skilled labor",
      "book service online",
      "ServiceHub",
    ],

    openGraph: {
      title: `Hire Top ${serviceName} Professionals Near You`,
      description: `Connect with experienced and highly-rated ${serviceName.toLowerCase()} service providers in your locality on ServiceHub.`,
      images: [
        {
          url: "/og-image.jpg", // Recommended: Add a good OG image
          width: 1200,
          height: 630,
          alt: `${serviceName} Services`,
        },
      ],
      type: "website",
      locale: "en_NG", // Change if needed
    },

    alternates: {
      canonical: `/services/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Service({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head />
      <div className="h-16" />

      <Worker category={slug} />

      <Footer />
    </div>
  );
}