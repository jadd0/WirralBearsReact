export default function BareLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main id="main" className="box-border flex w-full flex-1 flex-col items-center">
			{children}
		</main>
	);
}
