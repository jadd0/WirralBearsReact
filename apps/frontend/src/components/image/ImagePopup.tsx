import { Image } from '@wirralbears/backend-types';
import { CircleX } from 'lucide-react';

interface ImagePopupProps {
	image: Image;
	onClose: () => void;
}

export default function ImagePopup({ image, onClose }: ImagePopupProps) {
	const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
			onClick={handleParentClick}
		>
			<div
				className="
          relative
          bg-white
          rounded-lg
          shadow-lg
          p-4
          max-w-full
          w-[90vw]
          sm:w-[70vw]
          md:w-[50vw]
          flex
          flex-col
          items-center
        "
			>
				<button
					onClick={onClose}
					aria-label="Close"
					className="
            absolute
            top-3
            right-3
            bg-white
            rounded-full
            p-2
            shadow
            hover:bg-red-100
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
            transition
            z-10
          "
				>
					<CircleX className="w-7 h-7 text-red-500" />
				</button>
				<img
					src={image.url}
					alt=""
					className="max-h-[70vh] w-auto rounded-md object-contain"
				/>
			</div>
		</div>
	);
}
