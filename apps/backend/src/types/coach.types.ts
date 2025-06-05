import { coachRepository } from "@/server/repositories/coach.repo"; 


export type CoachPreview = Awaited<ReturnType<typeof coachRepository.findAll>>[number];
export type FullBlog = Awaited<ReturnType<typeof coachRepository.getBlogById>>;