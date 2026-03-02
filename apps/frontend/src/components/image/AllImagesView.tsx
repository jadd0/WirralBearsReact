import { useGetAllImages } from "@/hooks/image.hooks";
import { useImageLoader } from "@/lib/imageLoader";
import { useRef, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ImageDisplay from "./Image";

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
  onImageClick = (imageId: string, imageUrl: string) => {},
  data: propData,
  isLoading: propIsLoading = false,
}: AllImagesViewProps) {
  const shouldFetchData = !propData;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    shouldFetchData
      ? useGetAllImages()
      : {
          data: null,
          isLoading: false,
          fetchNextPage: () => {},
          hasNextPage: false,
          isFetchingNextPage: false,
        };

  const finalData = propData || data;
  const finalIsLoading = propData ? propIsLoading : isLoading;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !shouldFetchData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: "500px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, shouldFetchData]);

  // Raw images from API
  const allImages =
    finalData?.pages?.flatMap((page: any) => page.images || []) || [];

  // Only images that have finished loading (with dimensions)
  const loadedImages = useImageLoader(allImages);

  const isInitialLoading = finalIsLoading && allImages.length === 0;

  // Skeleton component for loading state
  const ImageSkeleton = () => (
    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg w-full h-full" />
  );

  return (
    <div className="flex flex-col min-h-screen px-8 sm:px-4">
      <div className="w-full max-w-5xl mx-auto mt-10">
        {/* Loading skeleton */}
        {isInitialLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ImageSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Actual masonry grid - only shows loaded images */}
        {loadedImages.length > 0 && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}
          >
            <Masonry gutter="16px">
              {loadedImages.map((image) => (
                <ImageDisplay
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

      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500">
          Fetching more images...
        </div>
      )}

      {!hasNextPage && loadedImages.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No more images to load
        </div>
      )}
    </div>
  );
}
