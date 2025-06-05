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
import { CoachPreview } from '@wirralbears/backend-types';

/**
 * Updates an existing coach
 * @returns The result of the update operation
 */
export const useEditCoach = (): ((
	configuredOptions?: CreateMutationOptions<
		(data: { caochData: BlogData; id: string }) => Promise<{ id: string }>,
		unknown
	>
) => CreateMutationResult<
	(data: { coachData: BlogData; id: string }) => Promise<{ id: string }>,
	unknown
>) => {
	return createConfigurableMutation(
		api.coach.editCoachOnServer,
		['coaches', 'edit'],
		{
			onSuccess: (data) => {
				toast.success('Coach updated successfully', {
					description: `Your coach has been updated with ID: ${data.id}`,
				});
			},
			onError: (error: Error) => {
				toast.error('Failed to update coach', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Saves a coach to the server
 * @returns The result of the save operation
 */
export const useSaveCoach = (): ((
	configuredOptions?: CreateMutationOptions<
		(coachData: BlogData) => Promise<{ id: string }>,
		unknown
	>
) => CreateMutationResult<
	(coachData: BlogData) => Promise<{ id: string }>,
	unknown
>) => {
	return createConfigurableMutation(
		api.coach.saveCoachToServer,
		['coaches', 'save'],
		{
			onSuccess: (data) => {
				toast.success('Coach saved successfully', {
					description: `Your coach has been saved with ID: ${data.id}`,
				});
			},
			onError: (error: Error) => {
				toast.error('Failed to save coach', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Fetches a coach by its ID
 * @param id - The ID of the coach to fetch
 * @returns The coach with the given ID
 */
export const useGetCoach = (id: string) =>
	useQuery({
		...queries.coach.getCoachById(id),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load coach', {
				description: error.message,
			});
		},
	});

/**
 * Hook for deleting a coach by its ID
 * @returns Mutation object with mutate function and states
 */
export const useDeleteCoach = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			// Call the API function directly instead of queryFn()
			return await api.coach.deleteCoach(id);
		},
		onSuccess: (data, id) => {
			toast.success('Coach deleted successfully');

			queryClient.invalidateQueries({
				queryKey: queries.coach.getAllCoachPreviews().queryKey,
			});

			queryClient.removeQueries({
				queryKey: queries.coach.getCoachById(id).queryKey,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to delete coach', {
				description: error.message,
			});
		},
	});
};

const fetchPosts = async (): Promise<CoachPreview[]> => {
	const response = await api.coach.getAllCoachPreviews();
	return response;
};

export const useGetAllCoachPreviews = () => {
	return useQuery<CoachPreview[]>({
		queryKey: ['posts'],
		queryFn: fetchPosts,
	});
};
