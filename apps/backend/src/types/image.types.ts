import { imageRepository } from "@/server/repositories/images.repo"

export type Image = Awaited<ReturnType<typeof imageRepository.getAllImages>>;