import { Image } from '@wirralbears/backend-types';
import ImagePopup from './ImagePopup';
import { useState, useEffect } from 'react';
import { useDeleteImage } from '@/hooks/image.hooks';

export default function ImageDisplay({
	image,
	popUpActivated,
	deleteImage,
}: {
	image: Image;
	popUpActivated?: boolean;
	deleteImage?: boolean;
}) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const { mutate: deleteImageMutation } = useDeleteImage();

	return (
		<div className="">
			{isPopupOpen && (
				<ImagePopup image={image} onClose={() => setIsPopupOpen(false)} />
			)}
			<div
				key={image.id}
				className=""
				onClick={() => {
					if (popUpActivated) {
						setIsPopupOpen(true);
					}

					if (deleteImage) {
						console.log('Deleting image:', image.id);
						deleteImageMutation(image.id);
					}
				}}
			>
				<img src={image.url} alt={image.alt} className="w-full h-auto" />
				<p className="mt-2">{image.title}</p>
			</div>
		</div>
	);
}
