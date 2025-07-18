import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const testSuites = pgTable("test_suites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'unit', 'integration', 'e2e'
  status: text("status").notNull(), // 'pending', 'running', 'passed', 'failed'
  testCount: integer("test_count").default(0),
  passingCount: integer("passing_count").default(0),
  failingCount: integer("failing_count").default(0),
  duration: integer("duration").default(0), // in milliseconds
  coverage: integer("coverage").default(0), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  suiteId: integer("suite_id").references(() => testSuites.id),
  testName: text("test_name").notNull(),
  status: text("status").notNull(), // 'passed', 'failed', 'skipped'
  duration: integer("duration").default(0),
  error: text("error"),
  stack: text("stack"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const debugLogs = pgTable("debug_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // 'info', 'warn', 'error', 'debug'
  message: text("message").notNull(),
  source: text("source"), // 'client', 'server', 'database'
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // 'response_time', 'memory', 'cpu', 'database'
  value: integer("value").notNull(),
  unit: text("unit").notNull(), // 'ms', 'mb', 'percentage'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertTestSuiteSchema = createInsertSchema(testSuites).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export const insertDebugLogSchema = createInsertSchema(debugLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TestSuite = typeof testSuites.$inferSelect;
export type InsertTestSuite = z.infer<typeof insertTestSuiteSchema>;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type DebugLog = typeof debugLogs.$inferSelect;
export type InsertDebugLog = z.infer<typeof insertDebugLogSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
