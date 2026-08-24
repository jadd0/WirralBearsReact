/**
 * A panel for a block of club copy.
 *
 * This used to be a dark slate card floating on a light page, with the colour
 * passed in by every call site. It is now a light surface that belongs to the
 * page; callers should not override the background.
 */
export function InfoBox({
	title,
	children,
	className = '',
}: {
	title?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section
			className={`rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-card)] md:p-9 ${className}`}
		>
			{title && (
				<h2 className="font-display text-2xl leading-tight font-extrabold tracking-[-0.02em] text-ink md:text-3xl">
					{title}
				</h2>
			)}
			<div className="mt-5 text-[17px] leading-relaxed text-ink-3 [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline [&_strong]:font-semibold [&_strong]:text-ink">
				{children}
			</div>
		</section>
	);
}
