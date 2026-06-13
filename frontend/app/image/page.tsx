"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

export default function ImageViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const image = searchParams.get("src");

  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white"
      >
        <X size={24} />
      </button>

      <img
        src={image}
        alt="Preview"
        className="max-h-[95vh] max-w-[95vw]"
      />
    </div>
  );
}