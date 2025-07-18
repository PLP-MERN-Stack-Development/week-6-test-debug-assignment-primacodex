import { 
  users, 
  testSuites, 
  testResults, 
  debugLogs, 
  performanceMetrics,
  type User, 
  type InsertUser,
  type TestSuite,
  type InsertTestSuite,
  type TestResult,
  type InsertTestResult,
  type DebugLog,
  type InsertDebugLog,
  type PerformanceMetric,
  type InsertPerformanceMetric
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Test Suites
  getTestSuites(): Promise<TestSuite[]>;
  getTestSuite(id: number): Promise<TestSuite | undefined>;
  createTestSuite(testSuite: InsertTestSuite): Promise<TestSuite>;
  updateTestSuite(id: number, updates: Partial<TestSuite>): Promise<TestSuite | undefined>;
  
  // Test Results
  getTestResults(suiteId: number): Promise<TestResult[]>;
  createTestResult(testResult: InsertTestResult): Promise<TestResult>;
  
  // Debug Logs
  getDebugLogs(limit?: number): Promise<DebugLog[]>;
  createDebugLog(log: InsertDebugLog): Promise<DebugLog>;
  
  // Performance Metrics
  getPerformanceMetrics(type?: string, limit?: number): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testSuites: Map<number, TestSuite>;
  private testResults: Map<number, TestResult>;
  private debugLogs: Map<number, DebugLog>;
  private performanceMetrics: Map<number, PerformanceMetric>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.testSuites = new Map();
    this.testResults = new Map();
    this.debugLogs = new Map();
    this.performanceMetrics = new Map();
    this.currentId = 1;
    
    // Initialize with sample test suites
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample test suites
    const unitSuite: TestSuite = {
      id: this.currentId++,
      name: "Unit Tests",
      type: "unit",
      status: "passed",
      testCount: 142,
      passingCount: 140,
      failingCount: 2,
      duration: 45000,
      coverage: 87,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const integrationSuite: TestSuite = {
      id: this.currentId++,
      name: "Integration Tests",
      type: "integration",
      status: "passed",
      testCount: 58,
      passingCount: 56,
      failingCount: 2,
      duration: 120000,
      coverage: 78,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const e2eSuite: TestSuite = {
      id: this.currentId++,
      name: "End-to-End Tests",
      type: "e2e",
      status: "failed",
      testCount: 24,
      passingCount: 22,
      failingCount: 2,
      duration: 180000,
      coverage: 65,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.testSuites.set(unitSuite.id, unitSuite);
    this.testSuites.set(integrationSuite.id, integrationSuite);
    this.testSuites.set(e2eSuite.id, e2eSuite);
    
    // Initialize debug logs
    this.initializeDebugLogs();
    
    // Initialize performance metrics
    this.initializePerformanceMetrics();
  }

  private initializeDebugLogs() {
    const logs = [
      { level: "info", message: "Test server started on port 3001", source: "server" },
      { level: "info", message: "Connected to test database", source: "database" },
      { level: "warn", message: "Using development JWT secret", source: "server" },
      { level: "debug", message: "Running unit tests for UserController", source: "server" },
      { level: "info", message: "UserController.createUser - PASSED", source: "server" },
      { level: "info", message: "UserController.getUserById - PASSED", source: "server" },
      { level: "error", message: "UserController.updateProfile - FAILED", source: "server" },
      { level: "error", message: "AssertionError: expected 200 to equal 400", source: "server" },
      { level: "debug", message: "Test cleanup completed", source: "server" },
      { level: "info", message: "Starting integration tests", source: "server" },
    ];
    
    logs.forEach(log => {
      const debugLog: DebugLog = {
        id: this.currentId++,
        level: log.level,
        message: log.message,
        source: log.source,
        metadata: null,
        createdAt: new Date(),
      };
      this.debugLogs.set(debugLog.id, debugLog);
    });
  }

  private initializePerformanceMetrics() {
    const metrics = [
      { metricType: "response_time", value: 142, unit: "ms" },
      { metricType: "memory", value: 248, unit: "mb" },
      { metricType: "cpu", value: 23, unit: "percentage" },
      { metricType: "database", value: 45, unit: "ms" },
    ];
    
    metrics.forEach(metric => {
      const perfMetric: PerformanceMetric = {
        id: this.currentId++,
        metricType: metric.metricType,
        value: metric.value,
        unit: metric.unit,
        timestamp: new Date(),
      };
      this.performanceMetrics.set(perfMetric.id, perfMetric);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTestSuites(): Promise<TestSuite[]> {
    return Array.from(this.testSuites.values());
  }

  async getTestSuite(id: number): Promise<TestSuite | undefined> {
    return this.testSuites.get(id);
  }

  async createTestSuite(testSuite: InsertTestSuite): Promise<TestSuite> {
    const id = this.currentId++;
    const suite: TestSuite = { 
      ...testSuite, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.testSuites.set(id, suite);
    return suite;
  }

  async updateTestSuite(id: number, updates: Partial<TestSuite>): Promise<TestSuite | undefined> {
    const suite = this.testSuites.get(id);
    if (!suite) return undefined;
    
    const updatedSuite = { ...suite, ...updates, updatedAt: new Date() };
    this.testSuites.set(id, updatedSuite);
    return updatedSuite;
  }

  async getTestResults(suiteId: number): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(
      result => result.suiteId === suiteId
    );
  }

  async createTestResult(testResult: InsertTestResult): Promise<TestResult> {
    const id = this.currentId++;
    const result: TestResult = { 
      ...testResult, 
      id, 
      createdAt: new Date()
    };
    this.testResults.set(id, result);
    return result;
  }

  async getDebugLogs(limit = 50): Promise<DebugLog[]> {
    const logs = Array.from(this.debugLogs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return logs;
  }

  async createDebugLog(log: InsertDebugLog): Promise<DebugLog> {
    const id = this.currentId++;
    const debugLog: DebugLog = { 
      ...log, 
      id, 
      createdAt: new Date()
    };
    this.debugLogs.set(id, debugLog);
    return debugLog;
  }

  async getPerformanceMetrics(type?: string, limit = 100): Promise<PerformanceMetric[]> {
    let metrics = Array.from(this.performanceMetrics.values());
    
    if (type) {
      metrics = metrics.filter(metric => metric.metricType === type);
    }
    
    return metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = this.currentId++;
    const perfMetric: PerformanceMetric = { 
      ...metric, 
      id, 
      timestamp: new Date()
    };
    this.performanceMetrics.set(id, perfMetric);
    return perfMetric;
  }
}

export const storage = new MemStorage();
