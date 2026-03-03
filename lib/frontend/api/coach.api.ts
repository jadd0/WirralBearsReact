import { CoachPreview } from "@/lib/db/repo";
import { Coaches } from "@/lib/db/schemas";
import { jsonFetch } from "./api";

export async function getAllCoachPreviews() {
  return jsonFetch<CoachPreview[]>("/api/manual/coaches");
}

export async function getCoachById(id: string) {
  return jsonFetch<Coaches>(`/api/manual/coaches/${id}`);
}

// TODO: type
export async function createCoach(payload: any) {
  return jsonFetch<Coaches>("/api/manual/coaches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// TODO: type
export async function updateCoach(id: string, payload: Partial<any>) {
  return jsonFetch<Coaches>(`/api/manual/coaches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCoach(id: string) {
  await jsonFetch<unknown>(`/api/manual/coaches/${id}`, {
    method: "DELETE",
  });
}
