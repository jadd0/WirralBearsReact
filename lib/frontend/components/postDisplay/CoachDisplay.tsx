import { useCoach } from "@/hooks";
import { toast } from "sonner";
import BlogContent from "./BlogContent";
import BlogSkeleton from "./BlogSkeleton";
import AdminActions from "./AdminActions";
import { FullBlog } from "@/shared/types";
import { useSession } from "next-auth/react";

export default function CoachDisplay({ id }: { id: string }) {
  const { data, loading, error } = useCoach(id);
  const { data: auth } = useSession();
  const blogData = data as FullBlog;

  if (error) {
    toast.error("Failed to load coach profile. Please try again later.");
  }

  return (
    <main className="w-full">
      <div
        className="w-full sm:pl-[60px] pl-[15px] pr-4 py-8"
        style={{ marginLeft: 0, marginRight: "auto" }}
      >
        {auth?.user && blogData && (
          <AdminActions id={id} data={blogData} coach={true} />
        )}
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <BlogSkeleton />
          ) : blogData ? (
            <>
              <BlogContent
                headings={blogData.headings}
                paragraphs={blogData.paragraphs}
                images={blogData.images}
              />
            </>
          ) : (
            <p>Coach profile not found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
