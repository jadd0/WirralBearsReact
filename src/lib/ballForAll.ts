/**
 * The ten Ball 4 All principles.
 *
 * These are club copy, not content managed in the CMS, so they live here and
 * always render. Where a matching photograph exists it is used as enhancement;
 * the grid must read correctly with no images at all.
 */
export type Principle = {
	title: string;
	desc: string;
	image?: string;
};

export const PRINCIPLES: Principle[] = [
	{ title: 'Joy', desc: "It's the essence of success." },
	{ title: 'Positivity', desc: 'Positive mental attitude is key.' },
	{
		title: 'Respect',
		desc: 'We treat others like we would like to be treated.',
		image: '/images/Respect.jpg',
	},
	{
		title: 'Equal focus & equal minutes',
		desc: 'We are all part of this team.',
	},
	{
		title: 'Dedication & effort',
		desc: "It's how we get better.",
		image: '/images/Dedication.jpg',
	},
	{
		title: 'Growth',
		desc: "It's where we are now, and where we will be in the future.",
		image: '/images/Growth.jpg',
	},
	{ title: 'Pass', desc: 'Because ball hogging ruins the game.' },
	{
		title: 'Defence',
		desc: 'It wins championships.',
		image: '/images/Defence.jpg',
	},
	{
		title: 'Shoot',
		desc: "When it's good and within range. The only miss is not taking a good shot.",
		image: '/images/Shoot.jpg',
	},
	{ title: 'Play', desc: 'Together as a team.' },
];
