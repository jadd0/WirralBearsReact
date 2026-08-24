import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Axios client to make requests to the app's own Next.js API routes.
 * No baseURL: every caller passes a path starting with /api/..., resolved
 * relative to the current origin.
 */
const client = axios.create({
	withCredentials: true,
});

/**
 * Wrapper around axios to make requests to the server
 * @param config Axios request configuration
 * @returns Promise<any>
 */
export const request = async (config: AxiosRequestConfig) => {
	const onError = (error: AxiosError) => {
		return Promise.reject(error);
	};

	const onSuccess = (response: AxiosResponse) => {
		return response;
	};

	return client.request(config).then(onSuccess).catch(onError);
};

export const is404Error = (error: unknown): boolean =>
	error instanceof AxiosError && error.response?.status === 404;
