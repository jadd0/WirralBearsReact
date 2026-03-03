import { useFetchOnMount } from "./useFetchOnMount";
import { useAsync } from "./useAsync";
import {
  getAllCoachPreviews,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
} from "@/api";
import type { Coaches } from "@/schemas";
import { CoachPreview } from "@/lib/db/repo/coach.repo";

export function useCoachPreviews() {
  return useFetchOnMount<CoachPreview[]>(getAllCoachPreviews);
}

export function useCoach(id: string | null) {
  const fn = async () => {
    if (!id) throw new Error("No id");
    return getCoachById(id);
  };
  return useFetchOnMount<Coaches>(fn);
}

export function useCreateCoach() {
  // TODO: type properly
  return useAsync((payload: any) => createCoach(payload));
}

export function useUpdateCoach() {
  return useAsync((id: string, payload: any) => updateCoach(id, payload));
}

export function useDeleteCoach() {
  return useAsync((id: string) => deleteCoach(id));
}
