import React from "react";

function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
          >
            {/* Cover */}
            <div className="relative h-40 sm:h-44">
              <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-zinc-800" />

              {/* Avatar */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="h-20 w-20 rounded-full border-4 border-white dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>

            <div className="pt-12 pb-6 px-5">
              {/* Name */}
              <div className="mx-auto mb-3 h-5 w-32 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />

              {/* Profession */}
              <div className="mx-auto mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />

              {/* Location */}
              <div className="flex justify-center mb-4">
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-5">
                <div className="h-3 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3 w-3/4 mx-auto rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <div className="flex-1 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                <div className="flex-1 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;