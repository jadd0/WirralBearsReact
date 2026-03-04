"use client"

import { useBlogPreviews } from "@/hooks";
import BlogAllPreviews from "@/components/blog/BlogAllPreviews";
import { Footer } from "@/components/layout/Footer";
import { LogoBanner } from "@/components/layout/LogoBanner";

export default function ViewBlogsPage() {
  const { data, loading } = useBlogPreviews();

  return (
    <div className="container min-w-full mx-auto">
      <LogoBanner />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Blogs</h1>
        <p className="text-lg text-gray-600">
          Discover our latest articles and insights
        </p>
      </header>

      <BlogAllPreviews isLoading={loading} blogs={data || []} />
      <Footer />
    </div>
  );
}
