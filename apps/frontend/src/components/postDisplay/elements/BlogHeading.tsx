interface BlogHeadingProps {
	text: string;
}

export default function BlogHeading({ text }: BlogHeadingProps) {
	return (
		<h2 className="text-2xl font-semibold text-gray-800 mt-2 break-words">
			{text}
		</h2>
	);
}
