export function InfoBox({ title, children, className = '' }) {
	return (
		<section
			className={`bg-gray-800 text-white rounded-lg shadow-md my-4 ${className}`}
		>
			<div className="p-4 sm:p-6">
				{title && (
					<h2 className="text-xl sm:text-2xl font-bold mb-3 text-center">
						{title}
					</h2>
				)}
				<div>{children}</div>
			</div>
		</section>
	);
}
