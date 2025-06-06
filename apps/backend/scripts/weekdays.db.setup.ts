import { db } from "@/db";
import { sessionDays } from "@/db/schema";
import { nanoid } from "nanoid";

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

const SESSION_ID_LENGTH = 7;



const now = new Date();

const sessionDaysArray = WEEKDAYS.map(day => ({
  id: nanoid(SESSION_ID_LENGTH),
  day,
  createdAt: now,
  updatedAt: now,
}));

console.log(sessionDaysArray);


/**
 * Insert recipe days into the database
 */
export async function dbInsertSessionDays() {
  await db.insert(sessionDays).values(sessionDaysArray).onConflictDoNothing();
}
