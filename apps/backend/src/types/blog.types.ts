import { blogRepository } from "@/server/repositories/blog.repo"; 


export type BlogPreview = Awaited<ReturnType<typeof blogRepository.findAll>>[number];
export type FullBlog = Awaited<ReturnType<typeof blogRepository.getBlogById>>;