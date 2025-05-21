import { api } from '@/api/api';
import { createConfigurableMutation } from '@/hooks/util/configurableMutation';
import { queries } from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { UseMutationResult } from '@tanstack/react-query';
import {
	CreateMutationOptions,
	CreateMutationResult,
} from '@tanstack/react-query';

/**
 * Saves a blog to the server
 * @returns The result of the save operation
 */
export const useSaveBlog = (): ((
	configuredOptions?: CreateMutationOptions<
		(blogData: BlogData) => Promise<{ id: string }>,
		unknown
	>
) => CreateMutationResult<
	(blogData: BlogData) => Promise<{ id: string }>,
	unknown
>) => {
	return createConfigurableMutation(
		api.blog.saveBlogToServer,
		['blogs', 'save'],
		{
			onSuccess: (data) => {
				toast.success('Blog saved successfully', {
					description: `Your blog has been saved with ID: ${data.id}`,
				});
			},
			onError: (error: Error) => {
				toast.error('Failed to save blog', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Fetches a blog by its ID
 * @param id - The ID of the blog to fetch
 * @returns The blog with the given ID
 */
export const useBlog = (id: string) =>
	useQuery({
		...queries.blog.getBlogById(id),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load blog', {
				description: error.message,
			});
		},
	});

export const getAllBlogPreviews = () => {
	api.blog.getAllBlogPreviews, ['blogs', 'getAll'];
};
