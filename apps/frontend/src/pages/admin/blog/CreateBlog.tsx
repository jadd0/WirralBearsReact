import { useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';

export default function BlogMakerPage() {
  const [blogData, setBlogData] = useState<BlogData>({ elements: [] });

  const handleBlogChange = (data: BlogData) => {
    setBlogData(data);
  };

  // Image upload handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the request to your API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      throw error;
    }
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
