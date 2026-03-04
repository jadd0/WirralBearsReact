import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://myuser:mypassword@127.0.0.1/wirralbears",
  },
});
