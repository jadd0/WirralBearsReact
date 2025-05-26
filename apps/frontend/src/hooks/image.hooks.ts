import { api } from '@/api/api';

import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetAllImages = (
	title: string,
	tagIds: number[],
	{ enabled = true }: { enabled?: boolean } = {}
) =>
	useInfiniteQuery({
		queryKey: ['posts-preview', 'title-tags', title, tagIds],
		queryFn: ({ pageParam }) => api.image.getAllImages(pageParam),
		initialPageParam: 0,
		getNextPageParam: ({ nextCursor }) => nextCursor,
		enabled: enabled,
	});
