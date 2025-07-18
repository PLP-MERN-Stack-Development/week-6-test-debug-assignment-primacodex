import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestSuiteSchema, insertDebugLogSchema, insertPerformanceMetricSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test Suites
  app.get("/api/test-suites", async (req, res) => {
    try {
      const testSuites = await storage.getTestSuites();
      res.json(testSuites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test suites" });
    }
  });

  app.get("/api/test-suites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testSuite = await storage.getTestSuite(id);
      if (!testSuite) {
        return res.status(404).json({ message: "Test suite not found" });
      }
      res.json(testSuite);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test suite" });
    }
  });

  app.post("/api/test-suites", async (req, res) => {
    try {
      const validatedData = insertTestSuiteSchema.parse(req.body);
      const testSuite = await storage.createTestSuite(validatedData);
      res.status(201).json(testSuite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create test suite" });
    }
  });

  app.post("/api/test-suites/:id/run", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testSuite = await storage.getTestSuite(id);
      if (!testSuite) {
        return res.status(404).json({ message: "Test suite not found" });
      }

      // Update status to running
      await storage.updateTestSuite(id, { status: "running" });

      // Simulate test execution
      setTimeout(async () => {
        const randomPassingCount = Math.floor(Math.random() * testSuite.testCount);
        const failingCount = testSuite.testCount - randomPassingCount;
        const status = failingCount === 0 ? "passed" : "failed";
        const duration = Math.floor(Math.random() * 120000) + 30000; // 30s to 2.5min

        await storage.updateTestSuite(id, {
          status,
          passingCount: randomPassingCount,
          failingCount,
          duration,
          updatedAt: new Date()
        });

        // Add debug log
        await storage.createDebugLog({
          level: "info",
          message: `Test suite ${testSuite.name} completed - ${status}`,
          source: "server",
          metadata: { suiteId: id, duration, status }
        });
      }, 2000);

      res.json({ message: "Test suite execution started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to run test suite" });
    }
  });

  app.post("/api/test-suites/run-all", async (req, res) => {
    try {
      const testSuites = await storage.getTestSuites();
      
      // Update all suites to running status
      for (const suite of testSuites) {
        await storage.updateTestSuite(suite.id, { status: "running" });
      }

      // Simulate execution of all test suites
      setTimeout(async () => {
        for (const suite of testSuites) {
          const randomPassingCount = Math.floor(Math.random() * suite.testCount);
          const failingCount = suite.testCount - randomPassingCount;
          const status = failingCount === 0 ? "passed" : "failed";
          const duration = Math.floor(Math.random() * 120000) + 30000;

          await storage.updateTestSuite(suite.id, {
            status,
            passingCount: randomPassingCount,
            failingCount,
            duration,
            updatedAt: new Date()
          });
        }

        await storage.createDebugLog({
          level: "info",
          message: "All test suites completed",
          source: "server",
          metadata: { totalSuites: testSuites.length }
        });
      }, 5000);

      res.json({ message: "All test suites execution started" });
    } catch (error) {
      res.status(500).json({ message: "Failed to run all test suites" });
    }
  });

  // Debug Logs
  app.get("/api/debug-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getDebugLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch debug logs" });
    }
  });

  app.post("/api/debug-logs", async (req, res) => {
    try {
      const validatedData = insertDebugLogSchema.parse(req.body);
      const log = await storage.createDebugLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create debug log" });
    }
  });

  // Performance Metrics
  app.get("/api/performance-metrics", async (req, res) => {
    try {
      const type = req.query.type as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const metrics = await storage.getPerformanceMetrics(type, limit);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance metrics" });
    }
  });

  app.post("/api/performance-metrics", async (req, res) => {
    try {
      const validatedData = insertPerformanceMetricSchema.parse(req.body);
      const metric = await storage.createPerformanceMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create performance metric" });
    }
  });

  // Test Results
  app.get("/api/test-results/:suiteId", async (req, res) => {
    try {
      const suiteId = parseInt(req.params.suiteId);
      const results = await storage.getTestResults(suiteId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
