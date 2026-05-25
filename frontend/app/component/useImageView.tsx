// useImageViewer.ts
import { useState, useCallback, useEffect } from "react";

export function useImageViewer() {
  const [image, setImage] = useState<string | null>(null);

  const openImage = useCallback((src: string) => {
    setImage(src);
  }, []);

  const closeImage = useCallback(() => {
    setImage(null);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
    };

    if (image) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [image, closeImage]);

  return { image, openImage, closeImage };
}