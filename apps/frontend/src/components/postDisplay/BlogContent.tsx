// components/BlogContent.tsx
import BlogHeading from './elements/BlogHeading';
import BlogParagraph from './elements/BlogParagraph';
import BlogImage from './elements/BlogImage';

interface BlogContentProps {
	headings: Array<{
		id: string;
		text: string;
		position: number;
	}>;
	paragraphs: Array<{
		id: string;
		text: string;
		position: number;
	}>;
	images: Array<{
		id: string | null;
		url: string | null;
		alt: string | null;
		position: number;
	}>;
}

export default function BlogContent({
	headings,
	paragraphs,
	images,
}: BlogContentProps) {
	// Combine all content elements and sort by position
	const allContent = [
		...headings.map((h) => ({ ...h, type: 'heading' as const })),
		...paragraphs.map((p) => ({ ...p, type: 'paragraph' as const })),
		...images.map((i) => ({ ...i, type: 'image' as const })),
	].sort((a, b) => a.position - b.position);

	return (
		<div className="flex flex-col gap-4">
			{allContent.map((item, index) => {
				switch (item.type) {
					case 'heading':
						return <BlogHeading key={`heading-${item.id}`} text={item.text} />;

					case 'paragraph':
						return (
							<BlogParagraph key={`paragraph-${item.id}`} text={item.text} />
						);

					case 'image':
						return <BlogImage key={`image-${item.id}-${index}`} image={item} />;

					default:
						return null;
				}
			})}
		</div>
	);
}
