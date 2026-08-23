'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CarouselComponent } from '@components/layout/Carousel';
import { MapboxMap } from '@components/layout/Mapbox';
import { BallForAllGrid } from '@components/layout/BallForAllGrid';
import BlogAllPreviews from '@components/blog/BlogAllPreviews';
import { useGetAllBlogPreviews } from '@hooks/blog.hooks';
import { useGetAllFirstCarouselImages } from '@hooks/image.hooks';

const JOIN_FORM_URL =
	'https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true';

interface CarouselImage {
	id?: string;
	imageId: string;
	key: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
}

export default function HomePage() {
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();
	const {
		data: carouselImages = [] as CarouselImage[],
		isLoading: carouselLoading,
	} = useGetAllFirstCarouselImages();

	const hasCarousel = (carouselImages as CarouselImage[]).length > 0;

	return (
		<>
			{/* Hero */}
			<section className="relative isolate overflow-hidden bg-ink">
				<Image
					src="/images/AZ4A5317.jpg"
					alt="Wirral Bears players in a training game at Woodchurch Sports Centre"
					fill
					priority
					sizes="100vw"
					className="object-cover object-[60%_center] opacity-60"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
				/>

				<div className="container-page relative flex min-h-[560px] flex-col justify-end py-16 md:min-h-[660px] md:py-24 lg:min-h-[720px]">
					<div className="max-w-2xl">
						<p className="text-[12px] font-semibold tracking-[0.18em] text-white/60 uppercase">
							Woodchurch, Wirral
						</p>
						<h1 className="mt-5 font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.035em] text-white">
							Building skills.
							<br />
							Building confidence.
							<br />
							<span className="text-brand">Building community.</span>
						</h1>
						<p className="mt-7 max-w-lg text-lg leading-relaxed text-white/70">
							Whether you are picking up a basketball for the first time or
							aiming for the next level, there is a place for you here.
							Beginner, intermediate or advanced.
						</p>
						<div className="mt-9 flex flex-wrap items-center gap-3">
							<a
								href={JOIN_FORM_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-xl bg-brand px-7 py-4 font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
							>
								Join a session
							</a>
							<Link
								href="/sessions"
								className="rounded-xl border border-white/25 px-7 py-4 font-semibold text-white transition-colors duration-200 hover:bg-surface/10"
							>
								See the timetable
							</Link>
						</div>
						<p className="mt-6 text-[15px] text-white/50">
							Your first taster session is free.
						</p>
					</div>
				</div>
			</section>

			{/* What the club is */}
			<section className="section relative overflow-hidden">
				<div className="grain absolute inset-0" aria-hidden="true" />
				<div className="container-page relative">
					<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
						<div className="lg:pt-6">
							<p className="eyebrow">About the club</p>
							<h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
								A club that makes room for everyone
							</h2>
							<p className="mt-6 text-lg leading-relaxed text-ink-3">
								We are a basketball club in Woodchurch running friendly,
								challenging sessions for all ages. Players arrive at very
								different levels, and the coaching meets them where they are.
							</p>
							<dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
								{[
									{
										term: 'Friendly, supportive coaching',
										desc: 'Coaches who know every player by name.',
									},
									{
										term: 'Sessions for all ages',
										desc: 'From primary school upwards, split by age group.',
									},
									{
										term: 'A free first session',
										desc: 'Try it properly before committing to anything.',
									},
									{
										term: 'Community on and off court',
										desc: 'The club does not end when the session does.',
									},
								].map((item) => (
									<div key={item.term} className="border-t border-line pt-4">
										<dt className="font-display font-bold text-ink">
											{item.term}
										</dt>
										<dd className="mt-1.5 text-[15px] leading-relaxed text-ink-3">
											{item.desc}
										</dd>
									</div>
								))}
							</dl>
						</div>

						<div className="relative">
							<div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
								<Image
									src="/images/AZ4A5625.jpg"
									alt="A Wirral Bears coach working with players during a session"
									width={1200}
									height={800}
									sizes="(min-width: 1024px) 44rem, 92vw"
									className="h-full w-full object-cover"
								/>
							</div>
							{/* Offset second image, deliberately breaking the column edge. */}
							<div className="relative -mt-16 ml-auto hidden w-2/3 overflow-hidden rounded-2xl border-4 border-paper shadow-[var(--shadow-lift)] sm:block lg:-mr-10">
								<Image
									src="/images/AZ4A3369.jpg"
									alt="Wirral Bears players during a game"
									width={900}
									height={600}
									sizes="(min-width: 1024px) 28rem, 60vw"
									className="h-full w-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Gallery carousel, only when there is something to show */}
			{(hasCarousel || carouselLoading) && (
				<section className="section bg-paper-2 py-20 md:py-24">
					<div className="container-page">
						<div className="flex flex-wrap items-end justify-between gap-4">
							<div>
								<p className="eyebrow">From the court</p>
								<h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
									Recent photographs
								</h2>
							</div>
							<Link
								href="/image/viewall"
								className="text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
							>
								View the full gallery
							</Link>
						</div>
						<div className="mt-10">
							<CarouselComponent
								images={carouselImages as CarouselImage[]}
								isLoading={carouselLoading}
							/>
						</div>
					</div>
				</section>
			)}

			{/* Ball 4 All */}
			<section className="section">
				<div className="container-page">
					<div className="max-w-2xl">
						<p className="eyebrow">Ball 4 All</p>
						<h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
							Ten principles, agreed by everyone
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-ink-3">
							Every player and every coach commits to the same ten principles.
							They are what keeps the club a fair and enjoyable place to play.
						</p>
					</div>
					<div className="mt-12">
						<BallForAllGrid />
					</div>
					<Link
						href="/ballforall"
						className="mt-10 inline-flex text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
					>
						Read the full commitment
					</Link>
				</div>
			</section>

			{/* Joining */}
			<section className="relative overflow-hidden bg-ink text-white">
				<div className="grain absolute inset-0 opacity-20" aria-hidden="true" />
				<div className="container-page relative grid gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
					<div>
						<p className="text-[12px] font-semibold tracking-[0.18em] text-brand uppercase">
							Thinking of joining?
						</p>
						<h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
							Turn up to a session for your age group
						</h2>
						<p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
							There is no trial process and nothing to pay up front. The first
							taster session is free, so you can be sure it suits you before
							committing.
						</p>
					</div>
					<div className="flex flex-col gap-3 lg:items-end">
						<a
							href={JOIN_FORM_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-xl bg-brand px-8 py-4 text-lg font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
						>
							Complete the joining form
						</a>
						<Link
							href="/sessions"
							className="inline-flex items-center justify-center rounded-xl border border-white/25 px-8 py-4 text-lg font-semibold transition-colors duration-200 hover:bg-surface/10"
						>
							Check session times
						</Link>
					</div>
				</div>
			</section>

			{/* Latest from the blog */}
			<section className="section">
				<div className="container-page">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="eyebrow">Club news</p>
							<h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
								Latest from the blog
							</h2>
						</div>
						<Link
							href="/blog/blogs"
							className="text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
						>
							All posts
						</Link>
					</div>
					<div className="mt-10">
						<BlogAllPreviews blogs={blogs} isLoading={blogsLoading} limit={3} />
					</div>
				</div>
			</section>

			{/* Location */}
			<section className="border-t border-line bg-paper-2">
				<div className="container-page grid gap-10 py-20 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
					<div>
						<p className="eyebrow">Find us</p>
						<h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
							Woodchurch Sports Centre
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-ink-3">
							Sessions run at Woodchurch, with parking on site. Check the
							timetable for the times that match your age group.
						</p>
						<a
							href="https://goo.gl/maps/2dHvRTcbWPFoZLoT6"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-7 inline-flex rounded-xl border border-line-strong bg-surface px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-paper"
						>
							Open in Google Maps
						</a>
					</div>
					<div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
						<MapboxMap height="440px" />
					</div>
				</div>
			</section>
		</>
	);
}
