import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api/api';
import { InstagramPost } from '@wirralbears/types/src/instagram.types';


export const useInstagramPosts = (limit: number = 3) => {
  return useQuery<InstagramPost[]>({
    queryKey: ['instagram-posts', limit],
    queryFn: () => api.instagram.getInstagramPosts(limit),
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });
};

export const useRefreshInstagramToken = () => {
  return useMutation({
    mutationFn: () => api.instagram.refreshInstagramToken(),
    onSuccess: () => {
      console.log('Token refreshed successfully');
    },
  });
};

// export const useInstagramAuthStatus = () => {
//   return useQuery({
//     queryKey: ['instagram-auth-status'],
//     queryFn: () => api.instagram.getInstagramAuthStatus(),
//     refetchOnWindowFocus: true,
//   });
// };
