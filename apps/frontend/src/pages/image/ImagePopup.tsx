import { Image } from '@wirralbears/backend-types';

interface ImagePopupProps {
	image: Image;
	onClose: () => void;
}

export default function ImagePopup({ image, onClose }: ImagePopupProps) {
	const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			console.log('Clicked outside the image, closing popup');
			onClose();
		}
	};

	return (
		<div
			className="min-w-full min-h-full absolute top-0 left-0 flex items-center justify-center"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
			onClick={handleParentClick}
		>
			<img src={image.url} alt="" />
		</div>
	);
}
