import { sessionRepository } from "@/server/repositories/session.repo"; 

export type FullSessionSchedule = Awaited<ReturnType<typeof sessionRepository.getFullSchedule>>;
