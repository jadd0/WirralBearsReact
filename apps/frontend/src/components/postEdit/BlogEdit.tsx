// @/components/editors/BlogEdit.tsx
import { useLayoutEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { FullBlog } from '@wirralbears/backend-types';
import { toast } from 'sonner';
import { useGetBlog, useEditBlog } from '@/hooks/blog.hooks';
import { convertFullBlogToBlogData } from '@/lib/editorUtils';

export function BlogEdit() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<BlogData>({ elements: [] });
  const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: fetchedBlog, isLoading } = useGetBlog(id ?? '');
  const { mutate: editBlog, isPending } = useEditBlog();

  useLayoutEffect(() => {
    if (location.state?.blogData) {
      const passedData = location.state.blogData as BlogData;
      setInitialData(passedData);
      setBlogData(passedData);
    } else if (fetchedBlog && !isLoading) {
      const convertedData = convertFullBlogToBlogData(fetchedBlog as FullBlog);
      setInitialData(convertedData);
      setBlogData(convertedData);
    }
  }, [location.state, fetchedBlog, isLoading]);

  const handleBlogChange = (data: BlogData) => {
    setBlogData(data);
    localStorage.setItem(`blog-editor-data-${id}`, JSON.stringify(data));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  const handleSave = async (data: BlogData) => {
    setIsSubmitting(true);
    try {
      await editBlog(
        { blogData: data, id: id! },
        {
          onSuccess: () => {
            localStorage.removeItem(`blog-editor-data-${id}`);
            toast.success('Blog updated successfully!');
            navigate(`/blog/${id}`);
          },
          onError: (error: any) => {
            toast.error('Failed to update blog', { description: error.message });
          },
        }
      );
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Loading blog data...</div>;
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
