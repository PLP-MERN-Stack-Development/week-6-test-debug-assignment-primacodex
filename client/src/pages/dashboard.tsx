import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  TestTubeDiagonal, 
  CheckCircle, 
  XCircle, 
  Shield, 
  TrendingUp,
  Box,
  Link,
  Bot,
  Terminal,
  Gauge,
  ShieldCheck,
  Database,
  Cpu,
  MemoryStick,
  Clock
} from "lucide-react";
import TestSuiteCard from "@/components/TestSuiteCard";
import TestResults from "@/components/TestResults";
import DebugConsole from "@/components/DebugConsole";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import CodeCoverage from "@/components/CodeCoverage";
import { TestSuite } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: testSuites, refetch: refetchSuites } = useQuery<TestSuite[]>({
    queryKey: ["/api/test-suites"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const handleRunAllTests = async () => {
    try {
      await apiRequest("POST", "/api/test-suites/run-all");
      refetchSuites();
    } catch (error) {
      console.error("Failed to run all tests:", error);
    }
  };

  const handleRunTestSuite = async (type: string) => {
    try {
      const suite = testSuites?.find(s => s.type === type);
      if (suite) {
        await apiRequest("POST", `/api/test-suites/${suite.id}/run`);
        refetchSuites();
      }
    } catch (error) {
      console.error("Failed to run test suite:", error);
    }
  };

  const totalTests = testSuites?.reduce((sum, suite) => sum + suite.testCount, 0) || 0;
  const totalPassing = testSuites?.reduce((sum, suite) => sum + suite.passingCount, 0) || 0;
  const totalFailing = testSuites?.reduce((sum, suite) => sum + suite.failingCount, 0) || 0;
  const averageCoverage = testSuites?.length ? 
    Math.round(testSuites.reduce((sum, suite) => sum + suite.coverage, 0) / testSuites.length) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-green-500";
      case "failed": return "text-red-500";
      case "running": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case "unit": return <Box className="w-5 h-5" />;
      case "integration": return <Link className="w-5 h-5" />;
      case "e2e": return <Bot className="w-5 h-5" />;
      default: return <TestTubeDiagonal className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <TestTubeDiagonal className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">MERN Testing Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive testing and debugging suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All Systems Running</span>
              </div>
              <Button onClick={handleRunAllTests} className="bg-primary hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Suites</h2>
          </div>
          <div className="py-4">
            <div className="space-y-2 px-4">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "unit" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("unit")}
              >
                <Box className="mr-2 h-4 w-4" />
                Unit Tests
                <Badge variant="secondary" className="ml-auto">
                  {testSuites?.find(s => s.type === "unit")?.testCount || 0}
                </Badge>
              </Button>
              <Button
                variant={activeTab === "integration" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("integration")}
              >
                <Link className="mr-2 h-4 w-4" />
                Integration Tests
                <Badge variant="secondary" className="ml-auto">
                  {testSuites?.find(s => s.type === "integration")?.testCount || 0}
                </Badge>
              </Button>
              <Button
                variant={activeTab === "e2e" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("e2e")}
              >
                <Bot className="mr-2 h-4 w-4" />
                End-to-End Tests
                <Badge variant="secondary" className="ml-auto">
                  {testSuites?.find(s => s.type === "e2e")?.testCount || 0}
                </Badge>
              </Button>
            </div>
            
            <div className="mt-6 px-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Debug Tools</h3>
              <div className="space-y-2">
                <Button
                  variant={activeTab === "console" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("console")}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Debug Console
                </Button>
                <Button
                  variant={activeTab === "performance" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("performance")}
                >
                  <Gauge className="mr-2 h-4 w-4" />
                  Performance Monitor
                </Button>
                <Button
                  variant={activeTab === "coverage" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("coverage")}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Code Coverage
                </Button>
              </div>
            </div>

            <div className="mt-6 px-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Environment</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Client</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="p-6">
              {/* Test Results Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                    <TestTubeDiagonal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTests}</div>
                    <p className="text-xs text-muted-foreground">
                      +{testSuites?.length || 0} test suites
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Passing</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{totalPassing}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalTests > 0 ? Math.round((totalPassing / totalTests) * 100) : 0}% success rate
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failing</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{totalFailing}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalTests > 0 ? Math.round((totalFailing / totalTests) * 100) : 0}% failure rate
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                    <Shield className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{averageCoverage}%</div>
                    <p className="text-xs text-muted-foreground">
                      {averageCoverage >= 70 ? "Above" : "Below"} 70% target
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Test Suite Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Suite Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testSuites?.map((suite) => (
                        <div key={suite.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getTestIcon(suite.type)}
                            <div>
                              <div className="font-medium text-gray-900">{suite.name}</div>
                              <div className="text-sm text-gray-500">
                                {suite.type === "unit" && "Client & Server Components"}
                                {suite.type === "integration" && "API Endpoints & Database"}
                                {suite.type === "e2e" && "User Flows & Critical Paths"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">{suite.testCount}</div>
                            <div className={`text-sm ${getStatusColor(suite.status)}`}>
                              {suite.testCount > 0 ? Math.round((suite.passingCount / suite.testCount) * 100) : 0}% pass
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Test Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testSuites?.slice(0, 3).map((suite) => (
                        <div key={suite.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {suite.status === "passed" ? (
                              <CheckCircle className="text-green-500" />
                            ) : suite.status === "failed" ? (
                              <XCircle className="text-red-500" />
                            ) : (
                              <Clock className="text-blue-500" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{suite.name}</div>
                              <div className="text-sm text-gray-500">
                                {suite.updatedAt ? new Date(suite.updatedAt).toLocaleString() : "Never run"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {suite.duration ? `${Math.round(suite.duration / 1000)}s` : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Test Execution Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Execution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={handleRunAllTests} className="bg-primary hover:bg-blue-700">
                      <Play className="mr-2 h-4 w-4" />
                      Run All Tests
                    </Button>
                    <Button onClick={() => handleRunTestSuite("unit")} className="bg-green-600 hover:bg-green-700">
                      <Box className="mr-2 h-4 w-4" />
                      Unit Tests
                    </Button>
                    <Button onClick={() => handleRunTestSuite("integration")} className="bg-orange-600 hover:bg-orange-700">
                      <Link className="mr-2 h-4 w-4" />
                      Integration
                    </Button>
                    <Button onClick={() => handleRunTestSuite("e2e")} className="bg-purple-600 hover:bg-purple-700">
                      <Bot className="mr-2 h-4 w-4" />
                      E2E Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unit" className="p-6">
              <TestResults suiteType="unit" />
            </TabsContent>

            <TabsContent value="integration" className="p-6">
              <TestResults suiteType="integration" />
            </TabsContent>

            <TabsContent value="e2e" className="p-6">
              <TestResults suiteType="e2e" />
            </TabsContent>

            <TabsContent value="console" className="p-6">
              <DebugConsole />
            </TabsContent>

            <TabsContent value="performance" className="p-6">
              <PerformanceMonitor />
            </TabsContent>

            <TabsContent value="coverage" className="p-6">
              <CodeCoverage />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
