import { useState, useEffect } from "react";

interface LoadedImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export function useImageLoader(images: any[]) {
  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);

  useEffect(() => {
    if (!images.length) return;

    images.forEach((image) => {
      // Skip if already loaded
      if (loadedImages.find((img) => img.id === image.id)) return;

      const img = new Image();
      img.src = image.url;

      img.onload = () => {
        setLoadedImages((prev) => {
          // Prevent duplicates
          if (prev.find((p) => p.id === image.id)) return prev;

          return [
            ...prev,
            {
              id: image.id,
              url: image.url,
              alt: image.alt,
              width: img.naturalWidth,
              height: img.naturalHeight,
            },
          ];
        });
      };
    });
  }, [images]);

  return loadedImages;
}
