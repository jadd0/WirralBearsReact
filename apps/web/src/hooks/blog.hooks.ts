import { api } from '@/api/api';
import { createConfigurableMutation } from '@/hooks/util/configurableMutation';
import { queries } from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	CreateMutationOptions,
	CreateMutationResult,
} from '@tanstack/react-query';
import { BlogPreview } from '@wirralbears/backend-types';

/**
 * Hook for uploading multiple images
 * @returns Mutation object with mutate function and states
 */
export const useUploadMultipleImages = () => {
	return useMutation({
		mutationFn: async (data: { files: File[]; altTexts?: string[] }) => {
			return await api.blog.uploadMultipleImages(data.files, data.altTexts);
		},
		onSuccess: (data) => {
			toast.success('Images uploaded successfully', {
				description: `${data.totalUploaded} images uploaded successfully`,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to upload images', {
				description: error.message,
			});
		},
	});
};

/**
 * Updates an existing blog
 * @returns The result of the update operation
 */
export const useEditBlog = (): ((
	configuredOptions?: CreateMutationOptions<
		(data: { blogData: BlogData; id: string }) => Promise<{ id: string }>,
		unknown
	>
) => CreateMutationResult<
	(data: { blogData: BlogData; id: string }) => Promise<{ id: string }>,
	unknown
>) => {
	return createConfigurableMutation(
		api.blog.editBlogOnServer,
		['blogs', 'edit'],
		{
			onSuccess: (data) => {
				toast.success('Blog updated successfully', {
					description: `Your blog has been updated with ID: ${data.id}`,
				});
			},
			onError: (error: Error) => {
				toast.error('Failed to update blog', {
					description: error.message,
				});
			},
		}
	);
};

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
export const useGetBlog = (id: string) =>
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

/**
 * Hook for deleting a blog by its ID
 * @returns Mutation object with mutate function and states
 */
export const useDeleteBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			// Call the API function directly instead of queryFn()
			return await api.blog.deleteBlog(id);
		},
		onSuccess: (data, id) => {
			toast.success('Blog deleted successfully');

			queryClient.invalidateQueries({
				queryKey: queries.blog.getAllBlogPreviews().queryKey,
			});

			queryClient.removeQueries({
				queryKey: queries.blog.getBlogById(id).queryKey,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to delete blog', {
				description: error.message,
			});
		},
	});
};

const fetchPosts = async (): Promise<BlogPreview[]> => {
	const response = await api.blog.getAllBlogPreviews();
	return response;
};

export const useGetAllBlogPreviews = () => {
	return useQuery<BlogPreview[]>({
		queryKey: ['posts'],
		queryFn: fetchPosts,
	});
};
