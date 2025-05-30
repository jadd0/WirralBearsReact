import { useGetAllImages } from '@/hooks/image.hooks';
import { useEffect, useState } from 'react';
import ImageDisplay from './Image';

export default function AllImagesView({
	deleteImage,
	popUpActivated = true,
}: {
	deleteImage?: boolean;
	popUpActivated?: boolean;
}) {

	const { data, isLoading } = useGetAllImages();


	return (
		<div className="flex flex-col min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Image gallery</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-3 gap-4">
					{data?.pages.map((page) =>
						page.images.map((image) => (
							<ImageDisplay
								image={image}
								deleteImage={deleteImage}
								popUpActivated={popUpActivated}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
}
