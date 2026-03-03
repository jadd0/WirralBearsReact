"use client";

import { useRef, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ImageDisplay from "./Image";
import { useImageLoader } from "@/lib/utils/imageLoader";
import { useImageGallery } from "@/hooks";
import { Image } from "@/shared/types";

interface AllImagesViewProps {
  deleteImage?: boolean;
  popUpActivated?: boolean;
  clickable?: boolean;
  onImageClick?: (imageId: string, imageUrl: string) => void;
  data?: any;
  isLoading?: boolean;
}

export default function AllImagesView({
  deleteImage = false,
  popUpActivated = true,
  clickable = false,
  onImageClick = () => {},
  data: propData,
  isLoading: propIsLoading = false,
}: AllImagesViewProps) {
  const shouldFetchData = !propData;

  const { images, loading, error, hasMore, loadMore } = useImageGallery();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldFetchData) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          void loadMore();
        }
      },
      { threshold: 0, rootMargin: "500px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, shouldFetchData]);

  // Raw images from hook or from props
  const allImages = (propData as any)?.images ?? images;

  const finalIsLoading = propData ? propIsLoading : loading;

  // Only images that have finished loading (with dimensions)
  const loadedImages = useImageLoader(allImages);

  const isInitialLoading = finalIsLoading && allImages.length === 0;

  const ImageSkeleton = () => (
    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg w-full h-full" />
  );

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">Failed to load images.</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-8 sm:px-4">
      <div className="w-full max-w-5xl mx-auto mt-10">
        {isInitialLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ImageSkeleton key={idx} />
            ))}
          </div>
        )}

        {loadedImages.length > 0 && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}
          >
            <Masonry gutter="16px">
              {loadedImages.map((image: any) => (
                <ImageDisplay
                  key={image.id}
                  image={image}
                  deleteImage={deleteImage}
                  popUpActivated={popUpActivated}
                  clickable={clickable}
                  onImageClick={onImageClick}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}

        <div ref={sentinelRef} className="h-1 w-full" />
      </div>

      {loading && allImages.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          Fetching more images...
        </div>
      )}

      {!hasMore && loadedImages.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No more images to load
        </div>
      )}
    </div>
  );
}
