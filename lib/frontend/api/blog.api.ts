import { BlogPreview } from "@/lib/db/repo";
import { Blog } from "@/lib/db/schemas";
import { jsonFetch } from "./api";

export async function getAllBlogPreviews() {
  return jsonFetch<BlogPreview[]>("/api/blogs");
}

export async function getBlogById(id: string) {
  return jsonFetch<Blog>(`/api/blogs/${id}`);
}

export async function createBlog(payload: any) {
  //TODO: type
  return jsonFetch<Blog>("/api/blogs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
// TODO: type properly
export async function updateBlog(id: string, payload: any) {
  return jsonFetch<Blog>(`/api/blogs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlog(id: string) {
  await jsonFetch<unknown>(`/api/blogs/${id}`, {
    method: "DELETE",
  });
}
