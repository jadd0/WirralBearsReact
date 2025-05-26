import { api } from '@/api/api';

import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetAllImages = () =>
	useInfiniteQuery({
		queryKey: ['image', 'allImages'],
		queryFn: ({ pageParam }) => api.image.getAllImages(pageParam),
		initialPageParam: 0,
		getNextPageParam: ({ nextCursor }) => nextCursor,
	});
