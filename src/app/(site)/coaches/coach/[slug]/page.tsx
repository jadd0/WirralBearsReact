import type { Metadata } from 'next';
import CoachViewPage from '@views/coach/CoachView.page';

export const metadata: Metadata = {
	title: 'Coach',
	description: 'A coach at Wirral Bears Basketball Club.',
};

export default function Page() {
	return <CoachViewPage />;
}
