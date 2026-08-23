import Image from 'next/image';
import Link from 'next/link';

export function LogoBanner({ className = '' }) {
	return (
		<div className="flex w-full justify-center">
			<Link href="/" className="my-4 block w-full max-w-[600px] px-4">
				<Image
					src="/images/WirralBearsBanner.png"
					alt="Wirral Bears Basketball Club"
					width={1200}
					height={400}
					priority
					className={`h-auto w-full ${className}`}
				/>
			</Link>
		</div>
	);
}
