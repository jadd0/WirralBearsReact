import Image from 'next/image';
import { PRINCIPLES } from '@lib/ballForAll';

/**
 * The ten principles as a numbered grid.
 *
 * Every card has the same media slot whether or not a photograph exists for
 * that principle, so the titles and copy sit on a shared baseline across the
 * row. Only half of the principles have a matching image in the library.
 */
export function BallForAllGrid() {
	return (
		<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{PRINCIPLES.map((principle, index) => {
				const number = String(index + 1).padStart(2, '0');

				return (
					<li
						key={principle.title}
						className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
					>
						<div className="relative h-36 w-full overflow-hidden bg-ink">
							{principle.image ? (
								<Image
									src={principle.image}
									alt=""
									fill
									sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw"
									className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.05]"
								/>
							) : (
								<div
									aria-hidden="true"
									className="grain absolute inset-0 flex items-center justify-center bg-ink"
								>
									<span className="font-display text-6xl font-extrabold text-white/10 tabular">
										{number}
									</span>
								</div>
							)}
							<span className="absolute top-3 left-3 rounded-md bg-brand px-2 py-1 font-display text-[11px] leading-none font-bold tracking-[0.1em] text-white tabular">
								{number}
							</span>
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
				);
			})}
		</ul>
	);
}
