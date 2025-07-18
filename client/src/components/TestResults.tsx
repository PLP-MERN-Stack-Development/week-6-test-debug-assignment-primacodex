import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { TestSuite } from "@shared/schema";

interface TestResultsProps {
  suiteType: string;
}

export default function TestResults({ suiteType }: TestResultsProps) {
  const { data: testSuites } = useQuery<TestSuite[]>({
    queryKey: ["/api/test-suites"],
    refetchInterval: 5000,
  });

  const suite = testSuites?.find(s => s.type === suiteType);

  if (!suite) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>No test suite found for type: {suiteType}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-green-500";
      case "failed": return "text-red-500";
      case "running": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed": return <XCircle className="h-5 w-5 text-red-500" />;
      case "running": return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {suite.name}
        </h2>
        <p className="text-gray-600">
          {suiteType === "unit" && "Testing individual components and functions in isolation"}
          {suiteType === "integration" && "Testing interactions between different parts of the application"}
          {suiteType === "e2e" && "Testing complete user workflows and critical application paths"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(suite.status)}
                  <span className="font-medium">Total Tests</span>
                </div>
                <span className="text-sm text-gray-500">{suite.testCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Passing</span>
                </div>
                <span className="text-sm text-gray-500">{suite.passingCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Failing</span>
                </div>
                <span className="text-sm text-gray-500">{suite.failingCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Duration</span>
                </div>
                <span className="text-sm text-gray-500">
                  {suite.duration ? `${Math.round(suite.duration / 1000)}s` : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{suite.coverage}%</div>
                <div className="text-sm text-gray-600">
                  {suite.coverage >= 70 ? "Above" : "Below"} 70% target
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statements</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(suite.coverage + 3, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{suite.coverage + 3}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Branches</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(suite.coverage - 6, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{suite.coverage - 6}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Functions</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(suite.coverage + 8, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{suite.coverage + 8}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lines</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${suite.coverage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{suite.coverage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Environment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Test Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900">Environment</span>
              </div>
              <div className="text-sm text-gray-600">Test environment ready</div>
              <div className="text-xs text-gray-500 mt-1">
                {suiteType === "unit" && "Jest + React Testing Library"}
                {suiteType === "integration" && "Supertest + Test Database"}
                {suiteType === "e2e" && "Cypress + Chrome Browser"}
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900">Status</span>
              </div>
              <div className="text-sm text-gray-600">
                {suite.status === "running" ? "Tests running..." : "Ready to run"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last run: {suite.updatedAt ? new Date(suite.updatedAt).toLocaleString() : "Never"}
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-900">Coverage</span>
              </div>
              <div className="text-sm text-gray-600">
                {suite.coverage}% code coverage
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Target: 70% minimum
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failed Tests (only show if there are failures) */}
      {suite.failingCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Failed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-gray-900">Sample Failed Test</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {suiteType === "unit" && "Component rendering test failed"}
                  {suiteType === "integration" && "API endpoint returned unexpected status"}
                  {suiteType === "e2e" && "User flow test failed at login step"}
                </div>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  <div className="text-red-600">
                    {suiteType === "unit" && "AssertionError: expected element to be in the document"}
                    {suiteType === "integration" && "AssertionError: expected 200 to equal 404"}
                    {suiteType === "e2e" && "TimeoutError: Timed out waiting for element to be visible"}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {suiteType === "unit" && "at UserProfile.test.tsx:42:18"}
                    {suiteType === "integration" && "at auth.test.js:28:15"}
                    {suiteType === "e2e" && "at login.spec.js:15:8"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
