'use client';

export default function BlogHeading({ text }: { text: string }) {
	return (
		<h2 className="mt-6 font-display text-2xl leading-tight font-extrabold tracking-[-0.02em] break-words text-ink md:text-3xl">
			{text}
		</h2>
	);
}
