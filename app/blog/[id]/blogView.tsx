"use client"

import { useParams } from "next/navigation";
import BlogDisplay from "@/components/postDisplay/BlogDisplay";
import { LogoBanner } from "@/components/layout/LogoBanner";
import { Footer } from "@/components/layout/Footer";

export default function BlogView() {
  const { id }: { id: string } = useParams();

  return (
    <div className="min-w-full">
      <LogoBanner />
      <BlogDisplay id={id ?? ""} />
      <Footer />
    </div>
  );
}
