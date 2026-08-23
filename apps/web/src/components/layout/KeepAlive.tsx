'use client';

import { useEffect } from 'react';
import { serverOriginUrl } from '@lib/network';

const KEEPALIVE_INTERVAL_MS = 5 * 60 * 1000;

/**
 * The API idles when it is not in use, so a first visit would otherwise wait on
 * a cold start. Pinging /health while someone is browsing keeps it warm.
 *
 * Disabled by default in development: there is nothing to keep warm locally,
 * and the repeating timer prevents headless captures from ever settling.
 */
export function KeepAlive() {
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_ENABLE_KEEPALIVE !== 'true') return;

		const ping = async () => {
			try {
				await fetch(serverOriginUrl('/health'), { method: 'GET' });
			} catch {
				// A failed keep-alive ping is not actionable for the visitor.
			}
		};

		ping();
		const interval = setInterval(ping, KEEPALIVE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	return null;
}
