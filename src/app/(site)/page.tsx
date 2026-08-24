import type { Metadata } from 'next';
import HomePage from '@views/Home.page';

export const metadata: Metadata = {
	title: 'Wirral Bears Basketball Club',
	description: 'A basketball club in Woodchurch, Wirral, running sessions for all ages and abilities.',
};

export default function Page() {
	return <HomePage />;
}
