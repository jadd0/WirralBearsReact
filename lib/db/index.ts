/**
 * The main file for the database module. This file exports all the database related functions and setup.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/schemas";

const queryClient = postgres("postgresql://myuser:mypassword@127.0.0.1/wirralbears", {
  max: 1,
});

export const db = drizzle(queryClient, { schema });
