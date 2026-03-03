import { imageRepository } from "@/lib/db/repo";

export type Image = Awaited<ReturnType<typeof imageRepository.getAllImages>>[number];
