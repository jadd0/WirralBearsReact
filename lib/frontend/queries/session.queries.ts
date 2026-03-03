import { api } from '@/api/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const session = createQueryKeys('session', {
  getSessionById: (id: string) => ({
    queryFn: async () => await api.session.getSessionById(id),
    queryKey: ['session', 'getById', id],
  }),
  getAllSessions: () => ({
    queryFn: async () => await api.session.getAllSessions(),
    queryKey: ['session', 'getAllSessions'],
  }),
  getFullSchedule: () => ({
    queryFn: async () => await api.session.getFullSchedule(),
    queryKey: ['session', 'getFullSchedule'],
  }),
  getSessionDay: (id: string) => ({
    queryFn: async () => await api.session.getSessionDay(id),
    queryKey: ['session', 'getSessionDay', id],
  }),
  deleteSession: (id: string) => ({
    queryFn: async () => await api.session.deleteSession(id),
    queryKey: ['session', 'delete', id],
  }),
});
