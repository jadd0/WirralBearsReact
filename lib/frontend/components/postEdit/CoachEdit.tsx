"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogEditor } from "@/components/blog/createBlog/BlogEditor";
import { BlogData as SharedBlogData, FullBlog } from "@/shared/types";
import { toast } from "sonner";
import { convertFullBlogToBlogData } from "@/lib/utils/blogUtils";
import { useCoach, useUpdateCoach } from "../../hooks";

export default function CoachEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [coachData, setCoachData] = useState<SharedBlogData>({ elements: [] });
  const [initialData, setInitialData] = useState<SharedBlogData>({
    elements: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const { data: fetchedCoach, loading } = useCoach(id ?? "");
  const { run: updateCoach, loading: isUpdating } = useUpdateCoach();

  // On load (replaces useLayoutEffect + location.state)
  useEffect(() => {
    if (!id) return;
    if (loading) return;

    // 1) Try to restore from localStorage (analogous to location.state.coachData)
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(`coach-editor-data-${id}`)
        : null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SharedBlogData;
        setInitialData(parsed);
        setCoachData(parsed);
        setIsBootstrapping(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored coach data", e);
        // fall through to fetchedCoach
      }
    }

    // 2) Fallback: use fetched coach
    if (fetchedCoach) {
      const converted = convertFullBlogToBlogData(fetchedCoach as FullBlog);
      setInitialData(converted);
      setCoachData(converted);
    }

    setIsBootstrapping(false);
  }, [id, fetchedCoach, loading]);

  const handleCoachChange = (data: SharedBlogData) => {
    setCoachData(data);
    if (id) {
      localStorage.setItem(`coach-editor-data-${id}`, JSON.stringify(data));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  const handleSave = async (data: SharedBlogData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateCoach(id, data);
      localStorage.removeItem(`coach-editor-data-${id}`);
      toast.success("Coach profile updated successfully!");
      router.push(`/coach/${id}`);
    } catch (error: any) {
      console.error("Error updating coach:", error);
      toast.error("Failed to update coach profile", {
        description: error?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBootstrapping || loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Loading coach data...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Edit Coach Profile
      </h1>

      <BlogEditor
        key={JSON.stringify(initialData)}
        initialData={initialData}
        onChange={handleCoachChange}
        onImageUpload={handleImageUpload}
        onSave={handleSave}
      />
    </div>
  );
}
