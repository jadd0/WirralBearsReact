export default function AddSession({ onClick }: { onClick: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center p-4 border rounded-lg">
			<button
				onClick={onClick}
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				Add Session
			</button>
		</div>
	);
}
