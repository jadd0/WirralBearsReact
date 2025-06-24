import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '@/db';
import { users, account_connections } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { env } from '@/env';

// Serialize user for session storage
passport.serializeUser((user: any, done) => {
	console.log('Serializing user:', user.id);
	done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
	try {
		console.log('Deserializing user ID:', id);
		const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

		if (user.length > 0) {
			console.log('User deserialized successfully:', user[0].id);
			done(null, user[0]);
		} else {
			console.log('User not found during deserialization:', id);
			done(null, false);
		}
	} catch (error) {
		console.error('Deserialization error:', error);
		done(error, null);
	}
});

passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const userEmail = profile.emails?.[0]?.value;

				if (!userEmail) {
					return done(null, false, {
						message: 'No email found in Google profile',
					});
				}

				const allowedEmails = [
					env.ADMIN_EMAIL_JADD,
					env.ADMIN_EMAIL_WIRRALBEARS,
					env.ADMIN_EMAIL_MARTIN,
					env.ADMIN_EMAIL_DOWDSTERS,
					env.ADMIN_EMAIL_SKYE,
				];

				console.log(
					'Email check:',
					userEmail,
					allowedEmails.includes(userEmail)
				);

				if (!allowedEmails.includes(userEmail)) {
					console.log('Unauthorised email attempt:', userEmail);
					return done(null, false, {
						message: 'Access denied: Email not authorised',
					});
				}

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

					const user = await db
						.select()
						.from(users)
						.where(eq(users.id, existingConnection[0].userId))
						.limit(1);

					console.log('Existing user authenticated:', user[0].id);
					return done(null, user[0]);
				} else {
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

					console.log('New authorised user created:', newUser[0].id);
					return done(null, newUser[0]);
				}
			} catch (error) {
				console.error('Google OAuth strategy error:', error);
				return done(error, null);
			}
		}
	)
);

export default passport;
