import { useLayoutEffect, useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContentMakerProps {
  contentType: 'blog' | 'coach';
  storageKey: string;
  useSaveHook: () => any;
  successRedirect: string;
  successMessage: string;
  errorMessage: string;
}

export function ContentMakerPage({
  contentType,
  storageKey,
  useSaveHook,
  successRedirect,
  successMessage,
  errorMessage
}: ContentMakerProps) {
  const [contentData, setContentData] = useState<BlogData>({ elements: [] });
  const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const saveMutation = useSaveHook();
  const { mutate: saveContent } = saveMutation();

  useLayoutEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setInitialData(parsedData);
        setContentData(parsedData);
      } catch (error) {
        console.error(`Failed to parse ${contentType} editor data:`, error);
        toast.error(`Failed to load saved ${contentType} data`);
      }
    }
  }, [contentType, storageKey]);

  const handleContentChange = (data: BlogData) => {
    setContentData(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  const handleSave = async (data: BlogData) => {
    setIsSubmitting(true);
    try {
      await saveContent(data, {
        onSuccess: () => {
          localStorage.removeItem(storageKey);
          toast.success(successMessage);
          navigate(successRedirect);
        },
        onError: (error: any) => {
          toast.error(errorMessage, { description: error.message });
        },
      });
    } catch (error) {
      console.error(`Error saving ${contentType}:`, error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Maker
      </h1>
      <BlogEditor
        key={JSON.stringify(initialData)}
        initialData={initialData}
        onChange={handleContentChange}
        onImageUpload={handleImageUpload}
        onSave={handleSave}
        coach={contentType === 'coach'}
      />
    </div>
  );
}
