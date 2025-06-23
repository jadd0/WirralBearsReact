import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '@/db';
import { users, account_connections } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { env } from '@/env';

passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {


				// Check if user already exists
				const existingConnection = await db
					.select()
					.from(account_connections)
					.where(
						and(
							eq(account_connections.provider, 'google'),
							eq(account_connections.providerAccountId, profile.id)
						)
					)
					.limit(1);

				if (existingConnection.length > 0) {

					// Update tokens
					await db
						.update(account_connections)
						.set({
							accessToken,
							refreshToken,
						})
						.where(
							and(
								eq(account_connections.provider, 'google'),
								eq(account_connections.providerAccountId, profile.id)
							)
						);

					// Get the user
					const user = await db
						.select()
						.from(users)
						.where(eq(users.id, existingConnection[0].userId))
						.limit(1);

					return done(null, user[0]);
				} else {

					// Create new user and connection
					const newUser = await db
						.insert(users)
						.values({
							username:
								profile.displayName ||
								profile.emails?.[0]?.value ||
								'Unknown User',
						})
						.returning();

					await db.insert(account_connections).values({
						userId: newUser[0].id,
						provider: 'google',
						email: profile.emails?.[0]?.value,
						providerAccountId: profile.id,
						accessToken,
						refreshToken,
					});

					console.log('New user created:', newUser[0].id);
					return done(null, newUser[0]);
				}
			} catch (error) {
				console.error('Google OAuth strategy error:', error);
				return done(error, null);
			}
		}
	)
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
	try {

		const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

		done(null, user[0] || null);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
