/**
 * The standard opening block for an interior page: eyebrow, title, and an
 * optional standfirst. Keeps every page starting on the same rhythm instead of
 * each one inventing its own centred hero.
 */
export function PageHeader({
	eyebrow,
	title,
	lead,
	children,
}: {
	eyebrow?: string;
	title: React.ReactNode;
	lead?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<header className="border-b border-line bg-paper-2">
			<div className="container-page py-14 md:py-20">
				<div className="max-w-3xl">
					{eyebrow && <p className="eyebrow">{eyebrow}</p>}
					<h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-ink">
						{title}
					</h1>
					{lead && (
						<p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-3 md:text-xl">
							{lead}
						</p>
					)}
					{children}
				</div>
			</div>
		</header>
	);
}
