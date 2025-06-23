import { Link } from 'react-router-dom';

export default function ImageSelectionPage() {
	return (
		<div className="flex flex-col">
			<h1 className="text-3xl font-bold mb-8 text-center">Image Selection</h1>
			<p className="text-lg text-gray-600">
				From here, choose (click on) which carousel to select the images for:
			</p>

			<div className="flex-row flex w-full mt-15 justify-center gap-12">
				<Link
					to="/admin/imageSelection/b4a"
					className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
				>
					<h2 className="text-2xl font-bold">First Carousel</h2>
				</Link>

				<Link
					to="/admin/imageSelection/first"
					className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
				>
					<h2 className="text-2xl font-bold">B4A Carousel</h2>
				</Link>
			</div>
		</div>
	);
}
