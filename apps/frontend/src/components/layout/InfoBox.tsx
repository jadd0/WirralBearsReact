export function InfoBox({
	title,
	children,
	className = '',
}: {
	title?: any;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={`rounded-2xl shadow-lg my-6 p-6 ${className}`}>
			{title && (
				<h2 className="text-xl sm:text-2xl font-bold mb-3 text-center text-white">
					{title}
				</h2>
			)}
			<div className="text-white">{children}</div>
		</section>
	);
}
