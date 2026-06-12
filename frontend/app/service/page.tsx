import Footer from "../component/footer";
import Head from "../component/head";
import Workers from "./Worker";

// Dynamic Metadata for Better SEO
export const metadata = {
  title: "Hire Local Professionals Near You | ServiceHub - Best Skilled Workers",
  description:
    "Find and hire top-rated local professionals for plumbing, electrical, carpentry, cleaning, painting, welding & more. Book trusted skilled workers near you with verified reviews and instant quotes.",
  
  keywords: [
    "hire local professionals",
    "skilled workers near me",
    "book plumbers near me",
    "electricians near me",
    "carpenters near me",
    "home services",
    "local handyman",
    "ServiceHub",
    "hire workers online",
    "trusted service providers",
  ],

  openGraph: {
    title: "Hire Top Local Professionals Near You - ServiceHub",
    description:
      "Connect with reliable and highly-rated skilled workers in your area. Fast, safe and trusted service booking platform.",
    images: [
      {
        url: "/og-image.jpg", // Add a good hero image here
        width: 1200,
        height: 630,
        alt: "ServiceHub - Hire Local Professionals",
      },
    ],
    type: "website",
    locale: "en_NG",
  },

  alternates: {
    canonical: "/workers",   // Change if your page URL is different
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Service() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head />
      <div className="h-16" />
      <Workers />
      <Footer />
    </div>
  );
}