export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-4 py-16">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 md:p-14 border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-8">
          Have a question, feedback, or need support? Reach out to our team and we will get back to you as soon as possible.
        </p>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                Email:  <a href="mailto:support@servicehub.space" className="text-blue-600 dark:text-blue-400 hover:underline">support@servicehub.space</a><br />
                Phone: <a href="tel:+2347068291163" className="text-blue-600 dark:text-blue-400 hover:underline">+234 706 829 1163</a><br />
                Address: Dawaki Abuja, Nigeria
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Need urgent help?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                For urgent account support or service issues, please email us with your order details and we&apos;ll respond quickly.
              </p>
            </div>
          </div>
          <form className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input type="text" placeholder="Your name" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea rows={6} placeholder="How can we help?" className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
