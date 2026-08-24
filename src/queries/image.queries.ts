import { api } from '@/api/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const image = createQueryKeys('image', {
	getAllFirstCarouselImages: () => ({
		queryFn: async () => await api.image.getAllFirstCarouselImages(),
		queryKey: ['image', 'firstCarousel', 'getAll'],
	}),
	getAllB4ACarouselImages: () => ({
		queryFn: async () => await api.image.getAllB4ACarouselImages(),
		queryKey: ['image', 'B4ACarousel', 'getAll'],
	}),
});
