import { sessionRepository } from "@/server/repositories/session.repo"; 

export type FullSessionSchedule = Awaited<ReturnType<typeof sessionRepository.getFullSchedule>>;
export type SessionDayWithSessions = Awaited<ReturnType<typeof sessionRepository.getSessionDay>>;
