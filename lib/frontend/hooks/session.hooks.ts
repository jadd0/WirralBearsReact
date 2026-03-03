import { useAsync } from "./useAsync";
import { useFetchOnMount } from "./useFetchOnMount";
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getFullSchedule,
  replaceFullSchedule,
} from "@/api";
import type {
  TrainingSession,
  FullTrainingSessionSchedule,
} from "@/lib/db/schemas";

export function useSessions() {
  return useFetchOnMount<TrainingSession[]>(getAllSessions);
}

export function useSession(id: string | null) {
  const fn = async () => {
    if (!id) throw new Error("No id");
    return getSessionById(id);
  };
  return useFetchOnMount<TrainingSession>(fn);
}

export function useCreateSession() {
  return useAsync(createSession);
}

export function useUpdateSession() {
  return useAsync(updateSession);
}

export function useDeleteSession() {
  return useAsync(deleteSession);
}

export function useFullSchedule() {
  return useFetchOnMount<FullTrainingSessionSchedule>(getFullSchedule);
}

export function useReplaceFullSchedule() {
  return useAsync(replaceFullSchedule);
}
