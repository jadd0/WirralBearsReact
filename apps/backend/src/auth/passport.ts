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
				// Get the user's email from the profile
				const userEmail = profile.emails?.[0]?.value;

				if (!userEmail) {
					return done(null, false, {
						message: 'No email found in Google profile',
					});
				}

				// CHECK IF EMAIL IS ALLOWED
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

				// Return false for unauthorised emails - this will trigger failureRedirect
				if (!allowedEmails.includes(userEmail)) {
					console.log('Unauthorised email attempt:', userEmail);
					return done(null, false, {
						message: 'Access denied: Email not authorised',
					});
				}

				// Logic for authorised emails
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
					// Update tokens and return user
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

					return done(null, user[0]);
				} else {
					// Create new user for authorised email
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
