import { api } from '@/api/api';
import { queries } from '@/queries';
import { useQuery } from '@tanstack/react-query';
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const staleTime = 1000 * 60 * 60; // 1 hour

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
	return useMutation({
		mutationFn: async (imageId: string) => {
			return await api.image.deleteImage(imageId);
		},
		onSuccess: () => {
			toast.success('Image deleted successfully');
		},
		onError: (error: Error) => {
			toast.error('Failed to delete blog', {
				description: error.message,
			});
		},
	});
};

export const useGetAllFirstCarouselImages = () =>
	useQuery({
		...queries.image.getAllFirstCarouselImages(),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games', {
				description: error.message,
			});
		},
	});

export const useGetAllB4ACarouselImages = () =>
	useQuery({
		...queries.image.getAllB4ACarouselImages(),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games', {
				description: error.message,
			});
		},
	});

export const useReplaceAllFirstCarouselImages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.image.replaceAllFirstCarouselImages,
		mutationKey: ['image', 'firstCarousel', 'replaceAll'],
		onSuccess: (data) => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['firstCarousel'] });

			toast.success('First carousel images updated successfully', {
				description: data.message,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to update first carousel images', {
				description: error.message,
			});
		},
	});
};

export const useReplaceAllB4ACarouselImages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.image.replaceAllB4ACarouselImages,
		mutationKey: ['image', 'B4ACarousel', 'replaceAll'],
		onSuccess: (data) => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['B4ACarousel'] });

			toast.success('B4A carousel images updated successfully', {
				description: data.message,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to update B4A carousel images', {
				description: error.message,
			});
		},
	});
};
