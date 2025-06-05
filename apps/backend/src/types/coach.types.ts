import { coachRepository } from "@/server/repositories/coach.repo"; 


export type CoachPreview = Awaited<ReturnType<typeof coachRepository.findAll>>[number];
export type FullCoach = Awaited<ReturnType<typeof coachRepository.getCoachById>>;