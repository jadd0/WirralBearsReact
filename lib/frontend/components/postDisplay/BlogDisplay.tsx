import { useBlog } from "@/hooks";
import { toast } from "sonner";
import BlogHeader from "./BlogHeader";
import BlogContent from "./BlogContent";
import BlogSkeleton from "./BlogSkeleton";
import AdminActions from "./AdminActions";
import { useSession } from "next-auth/react";
import { FullBlog } from "@/shared/types";

export default function BlogDisplay({ id }: { id: string }) {
  const { data, loading, error } = useBlog(id);
  const { data: session, status } = useSession();
  const blogData = data as FullBlog;

  if (error) {
    toast.error("Failed to load blog post. Please try again later.");
  }

  return (
    <main className="w-full">
      <div className="w-full sm:pl-[60px] pl-[15px] pr-4 py-8">
        {session && blogData && (
          <AdminActions id={id} data={blogData} coach={false} />
        )}
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <BlogSkeleton />
          ) : blogData ? (
            <>
              <BlogHeader
                title={blogData.title}
                author={blogData.author}
                createdAt={blogData.createdAt}
              />
              <BlogContent
                headings={blogData.headings}
                paragraphs={blogData.paragraphs}
                images={blogData.images}
              />
            </>
          ) : (
            <p>Blog post not found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
