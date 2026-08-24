import 'server-only';
import { redirect } from 'next/navigation';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { accounts, authSessions, users, verificationTokens } from '@/db/schema';
import { env } from '@/env';

const ADMIN_EMAILS = [
	env.ADMIN_EMAIL_JADD,
	env.ADMIN_EMAIL_WIRRALBEARS,
	env.ADMIN_EMAIL_MARTIN,
	env.ADMIN_EMAIL_DOWDSTERS,
	env.ADMIN_EMAIL_SKYE,
].map((email) => email.trim().toLowerCase());

export function isAdminEmail(email?: string | null): boolean {
	if (!email) return false;
	return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: authSessions,
		verificationTokensTable: verificationTokens,
	}),
	session: { strategy: 'database' },
	trustHost: true,
	providers: [
		Google({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	pages: {
		signIn: '/login',
		error: '/login',
	},
	callbacks: {
		async signIn({ user }) {
			return Boolean(user.email);
		},
		async session({ session, user }) {
			const admin = isAdminEmail(user.email);
			session.user.id = user.id;
			session.user.isAdmin = admin;
			session.user.role = admin ? 'admin' : 'user';
			return session;
		},
	},
});

export async function requireAuth() {
	const session = await auth();
	if (!session?.user) throw new Error('Not authenticated');
	return session;
}

export async function requireAdmin() {
	const session = await requireAuth();
	if (!session.user.isAdmin) throw new Error('Not authorized');
	return session;
}

export type ActionFailure = { success: false; error: string };

/** For Server Actions: returns a failure object instead of throwing. */
export async function ensureAdmin(): Promise<ActionFailure | null> {
	try {
		await requireAdmin();
		return null;
	} catch {
		return { success: false, error: 'Not authorized' };
	}
}

/** For pages: redirects to /login on failure instead of throwing. */
export async function requireAdminPage() {
	try {
		return await requireAdmin();
	} catch {
		redirect('/login');
	}
}

export async function requireAuthPage() {
	try {
		return await requireAuth();
	} catch {
		redirect('/login');
	}
}
