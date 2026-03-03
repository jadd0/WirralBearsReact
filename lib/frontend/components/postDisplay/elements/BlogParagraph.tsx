interface BlogParagraphProps {
	text: string;
}

export default function BlogParagraph({ text }: BlogParagraphProps) {
	return (
		<p className="text-gray-700 leading-relaxed max-w-[500px]">
			{text}
		</p>
	);
}
