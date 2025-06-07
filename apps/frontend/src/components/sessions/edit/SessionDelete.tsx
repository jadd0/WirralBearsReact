import { Trash } from 'lucide-react';

export default function SessionDelete({
	onClick,
}: {
	sessionId: string;
	onClick?: () => void;
}) {
	return (
		<button
			className="text-red-500 hover:text-red-700 cursor-pointer"
			onClick={onClick}
			title="Delete Session"
		>
			<Trash className="h-4 w-4" />
		</button>
	);
}
