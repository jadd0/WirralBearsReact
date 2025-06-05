import { api } from '@/api/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const coach = createQueryKeys('coach', {
	getCoachById: (id: string) => ({
		queryFn: async () => await api.coach.fetchCoach(id),
		queryKey: ['coach', 'getById', id],
	}),
	getAllCoachPreviews: () => ({
		queryFn: async () => await api.coach.getAllCoachPreviews(),
		queryKey: ['coach', 'getAllCoachPreviews'],
	}),
	deleteCoach: (id: string) => ({
		queryFn: async () => await api.coach.deleteCoach(id),
		queryKey: ['caoch', 'delete', id]
	})
});
