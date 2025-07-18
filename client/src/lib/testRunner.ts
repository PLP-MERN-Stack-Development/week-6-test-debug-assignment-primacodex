import { apiRequest } from "./queryClient";

export class TestRunner {
  static async runAllTests(): Promise<void> {
    try {
      await apiRequest("POST", "/api/test-suites/run-all");
    } catch (error) {
      console.error("Failed to run all tests:", error);
      throw error;
    }
  }

  static async runTestSuite(suiteId: number): Promise<void> {
    try {
      await apiRequest("POST", `/api/test-suites/${suiteId}/run`);
    } catch (error) {
      console.error(`Failed to run test suite ${suiteId}:`, error);
      throw error;
    }
  }

  static async runTestsByType(type: string): Promise<void> {
    try {
      // First get all test suites
      const response = await fetch("/api/test-suites");
      const suites = await response.json();
      
      // Find the suite with the specified type
      const suite = suites.find((s: any) => s.type === type);
      if (suite) {
        await this.runTestSuite(suite.id);
      } else {
        throw new Error(`No test suite found for type: ${type}`);
      }
    } catch (error) {
      console.error(`Failed to run tests of type ${type}:`, error);
      throw error;
    }
  }

  static async getTestResults(suiteId: number): Promise<any[]> {
    try {
      const response = await fetch(`/api/test-results/${suiteId}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to get test results for suite ${suiteId}:`, error);
      throw error;
    }
  }

  static async createDebugLog(level: string, message: string, source?: string): Promise<void> {
    try {
      await apiRequest("POST", "/api/debug-logs", {
        level,
        message,
        source: source || "client",
      });
    } catch (error) {
      console.error("Failed to create debug log:", error);
      throw error;
    }
  }

  static async recordPerformanceMetric(
    metricType: string,
    value: number,
    unit: string
  ): Promise<void> {
    try {
      await apiRequest("POST", "/api/performance-metrics", {
        metricType,
        value,
        unit,
      });
    } catch (error) {
      console.error("Failed to record performance metric:", error);
      throw error;
    }
  }
}
