import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// This 'db' object is what you will use in your Server Actions
export const db = drizzle(pool, { schema });
