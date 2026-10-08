import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Analytics tables for TuniBehavior AI
export const governorates = mysqlTable("governorates", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  population: int("population"),
  urbanization: int("urbanization"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const behavioralSegments = mysqlTable("behavioral_segments", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  percentage: int("percentage"),
  avgAge: int("avgAge"),
  ecommerceRate: int("ecommerceRate"),
  socialMediaUsage: int("socialMediaUsage"),
  avgBasketSize: int("avgBasketSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const monthlyTrends = mysqlTable("monthly_trends", {
  id: int("id").autoincrement().primaryKey(),
  month: varchar("month", { length: 20 }).notNull(),
  consumption: varchar("consumption", { length: 20 }),
  mobility: varchar("mobility", { length: 20 }),
  digital: varchar("digital", { length: 20 }),
  opinion: varchar("opinion", { length: 20 }),
  economy: varchar("economy", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const governorateSentiments = mysqlTable("governorate_sentiments", {
  id: int("id").autoincrement().primaryKey(),
  governorateId: int("governorateId").notNull(),
  positive: varchar("positive", { length: 20 }),
  neutral: varchar("neutral", { length: 20 }),
  negative: varchar("negative", { length: 20 }),
  verbatims: text("verbatims"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const governorateBehaviors = mysqlTable("governorate_behaviors", {
  id: int("id").autoincrement().primaryKey(),
  governorateId: int("governorateId").notNull(),
  ecommerceRate: varchar("ecommerceRate", { length: 20 }),
  digitalPenetration: varchar("digitalPenetration", { length: 20 }),
  consumptionIndex: varchar("consumptionIndex", { length: 20 }),
  satisfactionScore: varchar("satisfactionScore", { length: 20 }),
  populationDensity: varchar("populationDensity", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pipelineStages = mysqlTable("pipeline_stages", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  progress: int("progress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Governorate = typeof governorates.$inferSelect;
export type BehavioralSegment = typeof behavioralSegments.$inferSelect;
export type MonthlyTrend = typeof monthlyTrends.$inferSelect;
export type GovernorateBehavior = typeof governorateBehaviors.$inferSelect;
export type PipelineStage = typeof pipelineStages.$inferSelect;
