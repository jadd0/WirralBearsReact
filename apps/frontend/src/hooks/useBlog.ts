import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';

// API functions
const saveBlogToServer = async (blogData: BlogData): Promise<{ id: string }> => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save blog');
  }

  return response.json();
};

const fetchBlog = async (id: string): Promise<BlogData> => {
  const response = await fetch(`/api/blogs/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch blog');
  }

  return response.json();
};

// Custom hooks
export const useSaveBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveBlogToServer,
    onSuccess: (data) => {
      toast.success('Blog saved successfully', {
        description: `Your blog has been saved with ID: ${data.id}`,
      });
      
      // Invalidate blogs list query if it exists
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to save blog', {
        description: error.message,
      });
    },
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlog(id),
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    onError: (error: Error) => {
      toast.error('Failed to load blog', {
        description: error.message,
      });
    },
  });
};
