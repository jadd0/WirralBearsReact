import { useCallback, useState } from "react";
import { useAsync } from "./useAsync";
import {
  getImages,
  deleteImage,
  getFirstCarouselImages,
  replaceFirstCarouselImages,
  getB4ACarouselImages,
  replaceB4ACarouselImages,
} from "@/api";
import type { ImagesPage, ImageListItem, CarouselImage } from "@/api";

// Infinite scroll gallery
export function useImageGallery() {
  const [images, setImages] = useState<ImageListItem[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (cursor === null || loading) return;
    setLoading(true);
    setError(null);
    try {
      const page: ImagesPage = await getImages(cursor);
      setImages((prev) => [...prev, ...page.images]);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  return { images, loading, error, hasMore, loadMore, setImages } as const;
}

export function useDeleteImage() {
  return useAsync((id: string) => deleteImage(id));
}

// Carousels

export function useFirstCarouselImages() {
  return useAsync<[], CarouselImage[]>(getFirstCarouselImages as any);
}

export function useReplaceFirstCarouselImages() {
  return useAsync(replaceFirstCarouselImages);
}

export function useB4ACarouselImages() {
  return useAsync<[], CarouselImage[]>(getB4ACarouselImages as any);
}

export function useReplaceB4ACarouselImages() {
  return useAsync(replaceB4ACarouselImages);
}
