"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogEditor } from "@/components/blog/createBlog/BlogEditor";
import { BlogData as SharedBlogData, FullBlog } from "@/shared/types";
import { toast } from "sonner";
import { convertFullBlogToBlogData } from "@/lib/utils/blogUtils";
import { useBlog, useUpdateBlog } from "../../hooks";

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [blogData, setBlogData] = useState<SharedBlogData>({ elements: [] });
  const [initialData, setInitialData] = useState<SharedBlogData>({
    elements: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const { data: fetchedBlog, loading } = useBlog(id ?? "");
  const { run: updateBlog, loading: isUpdating } = useUpdateBlog();

  // On load
  useEffect(() => {
    if (!id) return;
    if (loading) return;

    // 1) Try to restore from localStorage (analogous to location.state.blogData)
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(`blog-editor-data-${id}`)
        : null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SharedBlogData;
        setInitialData(parsed);
        setBlogData(parsed);
        setIsBootstrapping(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored blog data", e);
        // fall through to fetchedBlog
      }
    }

    // 2) Fallback: use fetched blog
    if (fetchedBlog) {
      const converted = convertFullBlogToBlogData(fetchedBlog as FullBlog);
      setInitialData(converted);
      setBlogData(converted);
    }

    setIsBootstrapping(false);
  }, [id, fetchedBlog, loading]);

  const handleBlogChange = (data: SharedBlogData) => {
    setBlogData(data);
    if (id) {
      localStorage.setItem(`blog-editor-data-${id}`, JSON.stringify(data));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  const handleSave = async (data: SharedBlogData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateBlog(id, data);
      toast.success("Blog updated successfully");
      localStorage.removeItem(`blog-editor-data-${id}`);
      router.push(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBootstrapping || loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Loading blog data...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog</h1>
      <BlogEditor
        key={JSON.stringify(initialData)}
        initialData={initialData}
        onChange={handleBlogChange}
        onImageUpload={handleImageUpload}
        onSave={handleSave}
      />
    </div>
  );
}
