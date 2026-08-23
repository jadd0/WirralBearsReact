'use client';

import AllImagesView from '@components/image/AllImagesView';
import { PageHeader } from '@components/layout/PageHeader';

export default function AllImagesViewPage() {
	return (
		<>
			<PageHeader
				eyebrow="Gallery"
				title="Photographs from the club"
				lead="Images from games, training sessions and club events, shot by Giannis of Icona Photo Service."
			/>
			<section className="section">
				<div className="container-page">
					<AllImagesView popUpActivated={true} deleteImage={false} />
				</div>
			</section>
		</>
	);
}
