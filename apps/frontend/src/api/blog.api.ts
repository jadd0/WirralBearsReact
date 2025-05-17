import { request } from "@/lib/network";
import { BlogData } from '@wirralbears/types';

/**
 * Saves a blog to the server
 * @param blogData - The blog data to save
 * @returns The ID of the saved blog
 */
export async function saveBlogToServer(blogData: BlogData) {
  const { data } = await request({
    url: '/api/blog/saveBlog',
    method: 'POST',
    data: blogData,
  });

  return data as { id: string };
}

/**
 * Fetches a blog by its ID
 * @param id - The ID of the blog to fetch
 * @returns The blog data
 */
export async function fetchBlog(id: string) {
  const { data } = await request({
    url: `/api/blogs/${id}`,
    method: 'GET',
  });

  return data as BlogData;
}
