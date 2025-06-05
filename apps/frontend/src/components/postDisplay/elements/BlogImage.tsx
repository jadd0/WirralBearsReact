interface BlogImageProps {
	image: {
		id: string | null;
		url: string | null;
		alt: string | null;
		position: number;
	};
}

export default function BlogImage({ image }: BlogImageProps) {
	if (!image.url) return null;

	return (
		<div className="max-w-[400px]">
			<img
				src={image.url}
				alt={image.alt || 'Blog image'}
				className="w-full h-auto rounded-lg shadow-sm"
			/>
		</div>
	);
}
