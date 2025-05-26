import { useGetAllImages } from "@/hooks/image.hooks"
import { useEffect, useState } from "react"
import ImageDisplay from "./Image";

export default function AllImagesViewPage() {
  const [images, setImages] = useState([]);

  const { data, isLoading } = useGetAllImages();

  console.log(data)

  function imageClickHandler() {

  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Images</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data?.pages.map((page) =>
            page.images.map((image) => (
              <ImageDisplay image={image} onClick={() => {console.log(image.id)}} /> 
            ))
          )}
        </div>
      )}
    </div>
  )
}