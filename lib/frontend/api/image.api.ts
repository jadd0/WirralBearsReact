import { jsonFetch } from "./api";

export type ImageListItem = {
  id: string;
  url: string;
  alt: string | null;
  createdAt: string;
};

export type ImagesPage = {
  images: ImageListItem[];
  nextCursor: number | null;
};

export type CarouselImage = {
  id: string;
  key: string;
  imageId: string;
  imageUrl: string;
};

// Infinite scroll gallery
export async function getImages(cursor = 0) {
  const qs = `?cursor=${cursor}`;
  return jsonFetch<ImagesPage>(`/api/manual/images${qs}`);
}

export async function deleteImage(id: string) {
  await jsonFetch<unknown>(`/api/manual/images/${id}`, {
    method: "DELETE",
  });
}

// First carousel
export async function getFirstCarouselImages() {
  return jsonFetch<CarouselImage[]>("/api/manual/images/first-carousel");
}

export async function replaceFirstCarouselImages(
  images: { imageId: string; key: string }[],
) {
  return jsonFetch<{ success: boolean }>("/api/manual/images/first-carousel", {
    method: "PUT",
    body: JSON.stringify(images),
  });
}

// B4A carousel
export async function getB4ACarouselImages() {
  return jsonFetch<CarouselImage[]>("/api/manual/images/b4a-carousel");
}

export async function replaceB4ACarouselImages(
  images: { imageId: string; key: string }[],
) {
  return jsonFetch<{ success: boolean }>("/api/manual/images/b4a-carousel", {
    method: "PUT",
    body: JSON.stringify(images),
  });
}
