import { db } from '@/db';
import { seasons } from '@/db/schema';
import { nanoid } from 'nanoid';

const YEARS = [
	'2022-23',
	'2023-24',
	'2024-25',
	'2025-26',
	'2026-27',
	'2027-28',
	'2028-29',
	'2029-30',
	'2030-31',
] as const;

const SESSION_ID_LENGTH = 7;

const now = new Date();

const genders = ['Male', 'Female', 'Mixed'];

// Create a flat array of season objects
const seasonsArray = YEARS.flatMap((year) =>
	genders.map((gender) => ({
		id: nanoid(SESSION_ID_LENGTH),
		season: year,
		gender,
		createdAt: now,
		updatedAt: now,
	}))
);

console.log(seasonsArray);

/**
 * Insert seasons into the database
 */
export async function dbInsertSeasons() {
	await db.insert(seasons).values(seasonsArray).onConflictDoNothing();
}
