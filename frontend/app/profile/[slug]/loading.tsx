import Head from "@/app/component/head";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <Head />
      <div className="h-14" />

      {/* Cover Photo Skeleton */}
      <div className="h-64 md:h-80 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
          <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">

            {/* Avatar Skeleton */}
            <div className="flex justify-center md:justify-start">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse border-4 border-white dark:border-zinc-900" />
            </div>

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              
              <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mx-auto md:mx-0" />

              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mx-auto md:mx-0" />

              <div className="flex gap-3 justify-center md:justify-start">
                <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              <div className="h-10 w-28 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Services Offered
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        </section>

        {/* Gallery Skeleton */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}