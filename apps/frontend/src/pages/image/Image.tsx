import { Image } from '@wirralbears/backend-types';

interface ImageProps {
	image: Image;
	onClick: () => void;
}

export default function ImageDisplay({ image, onClick }: ImageProps) {
	return (
		<div key={image.id} className="" onClick={onClick}>
			<img src={image.url} alt={image.alt} className="w-full h-auto" />
			<p className="mt-2">{image.title}</p>
		</div>
	);
}
