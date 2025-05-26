import { request } from '@/lib/network';


export async function getAllImages(cursor: number) {
  const { data } = await request({
		url: `/api/image/getAllImages/${cursor}`,
		method: 'GET',
	});

	return data;
}