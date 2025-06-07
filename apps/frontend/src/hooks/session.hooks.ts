import { api } from '@/api/api';
import { queries } from '@/queries';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createConfigurableMutation } from '@/hooks/util/configurableMutation';
import {
	CreateMutationOptions,
	CreateMutationResult,
} from '@tanstack/react-query';
import {
	Session,
	SessionDayWithSessions,
	FullSessionSchedule,
} from '@wirralbears/backend-types';

/**
 * Fetches all sessions
 */
export const useGetAllSessions = () =>
	useQuery({
		...queries.session.getAllSessions(),
		staleTime: 1000 * 60 * 5,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load sessions', {
				description: error.message,
			});
		},
	});

/**
 * Fetches a session by its ID
 */
export const useGetSessionById = (id: string) =>
	useQuery({
		...queries.session.getSessionById(id),
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load session', {
				description: error.message,
			});
		},
	});

/**
 * Fetches the full session schedule
 */
export const useGetFullSchedule = () =>
	useQuery({
		...queries.session.getFullSchedule(),
		staleTime: 1000 * 60 * 10,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load schedule', {
				description: error.message,
			});
		},
	});

/**
 * Updates the full schedule
 */
export const useUpdateFullSchedule = () => {
	return useMutation({
		mutationFn: (scheduleData: FullSessionSchedule) =>
			api.session.updateFullSchedule(scheduleData),
		onSuccess: () => {
			toast.success('Schedule updated successfully');
		},
		onError: (error: Error) => {
			toast.error('Failed to update schedule', {
				description: error.message,
			});
		},
	});
};

/**
 * Fetches a session day by its ID
 */
export const useGetSessionDay = (id: string) =>
	useQuery({
		...queries.session.getSessionDay(id),
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load session day', {
				description: error.message,
			});
		},
	});

/**
 * Creates a new session
 */
export const useCreateSession = (): ((
	configuredOptions?: CreateMutationOptions<
		(sessionData: Session) => Promise<boolean>,
		unknown
	>
) => CreateMutationResult<
	(sessionData: Session) => Promise<boolean>,
	unknown
>) => {
	return createConfigurableMutation(
		api.session.createSession,
		['session', 'create'],
		{
			onSuccess: () => {
				toast.success('Session created successfully');
			},
			onError: (error: Error) => {
				toast.error('Failed to create session', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Updates an existing session
 */
export const useUpdateSession = (): ((
	configuredOptions?: CreateMutationOptions<
		(sessionData: Session) => Promise<boolean>,
		unknown
	>
) => CreateMutationResult<
	(sessionData: Session) => Promise<boolean>,
	unknown
>) => {
	return createConfigurableMutation(
		api.session.updateSession,
		['session', 'update'],
		{
			onSuccess: () => {
				toast.success('Session updated successfully');
			},
			onError: (error: Error) => {
				toast.error('Failed to update session', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Deletes a session by its ID
 */
export const useDeleteSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			return await api.session.deleteSession(id);
		},
		onSuccess: (data, id) => {
			toast.success('Session deleted successfully');
			queryClient.invalidateQueries({
				queryKey: queries.session.getAllSessions().queryKey,
			});
			queryClient.removeQueries({
				queryKey: queries.session.getSessionById(id).queryKey,
			});
		},
		onError: (error: Error) => {
			toast.error('Failed to delete session', {
				description: error.message,
			});
		},
	});
};
