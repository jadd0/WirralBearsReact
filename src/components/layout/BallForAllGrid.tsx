import Image from 'next/image';
import { PRINCIPLES } from '@lib/ballForAll';

/**
 * The ten principles, in two bands.
 *
 * Only some of the ten have a matching photograph in the library. Rather than
 * give the rest a placeholder media slot -- which put them in the same visual
 * weight class as the real photographs and made them read as broken images --
 * the two groups get different tile shapes: wide photo cards, then a compact
 * text band. Both bands are derived from the data, so the section is correct
 * whether none, some or all ten principles gain a photograph later.
 */
export function BallForAllGrid() {
	const photographed = PRINCIPLES.filter((principle) => principle.image);
	const written = PRINCIPLES.filter((principle) => !principle.image);

	return (
		<div className="space-y-4">
			{photographed.length > 0 && (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{photographed.map((principle) => (
						<li
							key={principle.title}
							className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
						>
							<div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
								<Image
									src={principle.image as string}
									alt=""
									fill
									sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
									className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
								/>
							</div>
							<div className="flex flex-1 flex-col p-5">
								<h3 className="font-display text-lg leading-tight font-extrabold text-ink">
									{principle.title}
								</h3>
								<p className="mt-2 text-[15px] leading-relaxed text-ink-3">
									{principle.desc}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}

			{written.length > 0 && (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{written.map((principle) => (
						<li
							key={principle.title}
							className="flex flex-col justify-center rounded-2xl border border-line bg-paper-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface hover:shadow-[var(--shadow-lift)]"
						>
							<span
								aria-hidden="true"
								className="mb-4 block h-[3px] w-8 rounded-full bg-brand"
							/>
							<h3 className="font-display text-base leading-tight font-extrabold text-ink xl:text-[17px]">
								{principle.title}
							</h3>
							<p className="mt-2 text-[14px] leading-relaxed text-ink-3">
								{principle.desc}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
