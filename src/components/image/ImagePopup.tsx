'use client';

import { CircleX } from 'lucide-react';

/** The minimal shape any image-display consumer here actually needs, so a
 * full DB row (nullable url/alt) and a loaded/decoded image (non-null,
 * with dimensions) are interchangeable. */
export type DisplayableImage = {
	id: string;
	url?: string | null;
	alt?: string | null;
};

interface ImagePopupProps {
	image: DisplayableImage;
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
          bg-surface
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
            bg-surface
            rounded-full
            p-2
            shadow
            hover:bg-brand-soft
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
            transition
            z-10
          "
				>
					<CircleX className="w-7 h-7 text-brand" />
				</button>
				<img
					src={image.url ?? ''}
					alt=""
					className="max-h-[70vh] w-auto rounded-md object-contain"
				/>
			</div>
		</div>
	);
}