import { Image } from '@wirralbears/backend-types';
import ImagePopup from './ImagePopup';
import { useState, useEffect } from 'react';
import { Heading1 } from 'lucide-react';

export default function ImageDisplay({ image }: { image: Image }) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	useEffect(() => {}, []);

	return (
		<div className="">
			{isPopupOpen && (
				<ImagePopup image={image} onClose={() => setIsPopupOpen(false)} />
			)}
			<div
				key={image.id}
				className=""
				onClick={() => {
					setIsPopupOpen(true);
				}}
			>
				<img src={image.url} alt={image.alt} className="w-full h-auto" />
				<p className="mt-2">{image.title}</p>
			</div>
		</div>
	);
}
