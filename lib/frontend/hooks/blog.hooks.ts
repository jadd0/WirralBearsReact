import { useFetchOnMount } from "./useFetchOnMount";
import { useAsync } from "./useAsync";
import {
  getAllBlogPreviews,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/api";
import type { Blog } from "@/schemas";
import { BlogPreview } from "@/lib/db/repo/blog.repo";

export function useBlogPreviews() {
  return useFetchOnMount<BlogPreview[]>(getAllBlogPreviews);
}

export function useBlog(id: string | null) {
  const fn = async () => {
    if (!id) throw new Error("No id");
    return getBlogById(id);
  };
  return useFetchOnMount<Blog>(fn);
}

export function useCreateBlog() {
  // TODO: type properly
  return useAsync((payload: any) => createBlog(payload));
}

export function useUpdateBlog() {
  return useAsync((id: string, payload: any) =>
    updateBlog(id, payload),
  );
}

export function useDeleteBlog() {
  return useAsync((id: string) => deleteBlog(id));
}
