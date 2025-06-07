import { Trash } from 'lucide-react';

export default function SessionDelete({
	onClick,
}: {
	sessionId: string;
	onClick?: () => void;
}) {
	return (
		<button
			className="text-red-500 hover:text-red-700 p-2 rounded transition-colors cursor-pointer"
			onClick={onClick}
			title="Delete Session"
			type="button"
		>
			<Trash className="h-5 w-5" />
		</button>
	);
}
