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
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const { mutate: deleteImageMutation } = useDeleteImage();

	const handleDelete = () => {
		console.log('Deleting image:', image.id);
		deleteImageMutation(image.id);
		setShowDeleteConfirm(false);
	};

	return (
		<div className="">
			{isPopupOpen && (
				<ImagePopup image={image} onClose={() => setIsPopupOpen(false)} />
			)}

			{showDeleteConfirm && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
				>
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this image? This action cannot be
							undone.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				key={image.id}
				className=""
				onClick={() => {
					if (popUpActivated) {
						setIsPopupOpen(true);
					}

					if (deleteImage) {
						setShowDeleteConfirm(true);
					}
				}}
			>
				<img src={image.url} alt={image.alt} className="w-full h-auto rounded-md" />
				<p className="mt-2">{image.title}</p>
			</div>
		</div>
	);
}
