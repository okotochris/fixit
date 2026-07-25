import Footer from "../component/footer";
import Head from "../component/head";

export default function AboutUsPage() {
  return (
    <>
    <Head/>
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-4 py-16">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 md:p-14 border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-8">
          serviceHub is a trusted service marketplace built to connect homeowners and businesses with reliable local professionals. Our mission is to make it easy for people to find qualified plumbers, electricians, carpenters, cleaners, painters, and other skilled workers in one place.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What We Do</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-8">
              We help clients post service requests, compare professionals, and book trusted workers for home improvements, repairs, and maintenance. Professionals can grow their business by reaching customers who need the exact services they offer.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Why Choose serviceHub</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 leading-8">
              <li>Verified professionals with strong reputations.</li>
              <li>Transparent service listings and pricing.</li>
              <li>Easy booking, messaging, and project coordination.</li>
              <li>Quality assurance through reviews and ratings.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-8">
            We are committed to building a safer, more convenient service network for clients and professionals. From customer support to platform security, we continuously improve the experience so users can complete jobs with confidence and peace of mind.
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
