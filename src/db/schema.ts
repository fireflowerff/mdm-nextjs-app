// src/db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  countryName: varchar("country_name", { length: 100 }).notNull(),
  countryCode: varchar("country_code", { length: 10 }),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  memberCode: varchar("member_code", { length: 20 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  email: varchar("email", { length: 100 }),
  countryId: integer("country_id").references(() => countries.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});
