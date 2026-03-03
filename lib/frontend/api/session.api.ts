import { FullTrainingSessionSchedule, TrainingSession } from "@/lib/db/schemas";
import { jsonFetch } from "./api";

export async function getAllSessions() {
  return jsonFetch<TrainingSession[]>("/api/manual/sessions");
}

export async function getSessionById(id: string) {
  return jsonFetch<TrainingSession>(`/api/manual/sessions/${id}`);
}

export async function createSession(
  payload: Omit<TrainingSession, "id" | "createdAt" | "updatedAt">,
) {
  return jsonFetch<TrainingSession>("/api/manual/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSession(
  id: string,
  payload: Partial<Omit<TrainingSession, "id" | "createdAt" | "updatedAt">>,
) {
  return jsonFetch<TrainingSession>(`/api/manual/sessions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteSession(id: string) {
  await jsonFetch<unknown>(`/api/manual/sessions/${id}`, {
    method: "DELETE",
  });
}

export async function getFullSchedule() {
  return jsonFetch<FullTrainingSessionSchedule>("/api/manual/sessions/schedule");
}

export async function replaceFullSchedule(
  schedule: FullTrainingSessionSchedule,
) {
  return jsonFetch<{ success: boolean }>("/api/manual/sessions/schedule", {
    method: "PUT",
    body: JSON.stringify(schedule),
  });
}
