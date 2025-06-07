import { Button } from '@/components/ui/button';

export default function SaveSessions({
	onClick,
	onSuccess,
}: {
	onClick: () => void;
	onSuccess?: () => void;
}) {
	return (
		<Button
			className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow cursor-pointer"
			onClick={() => {
				onClick();
				onSuccess?.();
			}}
		>
			Save All Changes
		</Button>
	);
}
