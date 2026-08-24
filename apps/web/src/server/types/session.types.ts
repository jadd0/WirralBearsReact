import { sessionRepository } from '@/server/repositories/session.repo';

export type SessionDayWithSessions = Awaited<ReturnType<typeof sessionRepository.getSessionDay>>;
