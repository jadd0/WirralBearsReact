import { useGetAllImages } from "@/hooks/image.hooks"
import { useEffect, useState } from "react"

export default function AllImagesViewPage() {
  const [images, setImages] = useState([]);

  const { data, isLoading } = useGetAllImages();

  console.log(data)

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Images</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data?.pages.map((page) =>
            page.images.map((image) => (
              <div key={image.id} className="border p-2 rounded">
                <img src={image.url} alt={image.title} className="w-full h-auto" />
                <p className="mt-2">{image.title}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}