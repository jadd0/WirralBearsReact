'use client';

interface BlogHeaderProps {
	title: string;
	author: { username: string } | null;
	createdAt: Date;
}

export default function BlogHeader({
	title,
	author,
	createdAt,
}: BlogHeaderProps) {
	const date = new Date(createdAt);

	return (
		<header className="border-b border-line pb-8">
			<h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-ink">
				{title}
			</h1>
			<div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-ink-4">
				{author && (
					<>
						<span className="font-medium text-ink-3">{author.username}</span>
						<span aria-hidden="true">&middot;</span>
					</>
				)}
				<time dateTime={date.toISOString()}>
					{date.toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</time>
			</div>
		</header>
	);
}
