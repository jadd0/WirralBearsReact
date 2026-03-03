/**
 * The main file for the database module. This file exports all the database related functions and setup.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/schemas"; // adjust to your actual path

const queryClient = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export const db = drizzle(queryClient, { schema });
