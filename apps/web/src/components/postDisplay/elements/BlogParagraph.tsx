'use client';

export default function BlogParagraph({ text }: { text: string }) {
	return <p className="text-[17px] leading-[1.75] text-ink-3">{text}</p>;
}
