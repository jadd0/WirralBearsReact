import { toast } from 'sonner';

export const sessionToasts = {
	validationError: (error: Error) => {
		toast.error('Invalid Sessions', {
			description: error.message,
			duration: 10000,
			action: {
				label: 'Dismiss',
				onClick: () => {},
			},
		});
	},
	success: () => toast.success('Sessions saved successfully'),
	error: () => toast.error('Failed to save sessions'),
};
