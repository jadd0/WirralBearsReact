// app/page.tsx
"use client";

import { useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';

export default function BlogMakerPage() {
  const [blogData, setBlogData] = useState<BlogData>({ elements: [] });

  const handleBlogChange = (data: BlogData) => {
    setBlogData(data);
    console.log('Blog data updated:', data);
    // Here you would typically save the data or perform other actions
  };

  // This is where you would implement your image upload hook
  const handleImageUpload = async (file: File): Promise<string> => {
    // This is a placeholder - replace with your actual upload logic
    console.log('Uploading file:', file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a placeholder URL - in a real app, this would be the URL from your upload service
    return URL.createObjectURL(file);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Maker</h1>
      <BlogEditor 
        onChange={handleBlogChange} 
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
