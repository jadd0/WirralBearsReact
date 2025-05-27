import { api } from '@/api/api';

import {
	useInfiniteQuery,
	useQueryClient,
	useMutation,
} from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetAllImages = () =>
	useInfiniteQuery({
		queryKey: ['image', 'allImages'],
		queryFn: ({ pageParam }) => api.image.getAllImages(pageParam),
		initialPageParam: 0,
		getNextPageParam: ({ nextCursor }) => nextCursor,
	});

/**
 * Hook for deleting a blog by its ID
 * @returns Mutation object with mutate function and states
 */
export const useDeleteImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (imageId: string) => {
			return await api.image.deleteImage(imageId);
		},
		onSuccess: (data, id) => {
			toast.success('Image deleted successfully');
		},
		onError: (error: Error) => {
			toast.error('Failed to delete blog', {
				description: error.message,
			});
		},
	});
};
