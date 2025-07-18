import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function CodeCoverage() {
  const overallCoverage = 84;
  const statementsCoverage = 87;
  const branchesCoverage = 78;
  const functionsCoverage = 92;
  const linesCoverage = 85;

  const moduleCoverage = [
    { name: "Authentication", path: "auth/", coverage: 96, status: "excellent" },
    { name: "User Management", path: "user/", coverage: 72, status: "good" },
    { name: "Data Models", path: "models/", coverage: 88, status: "excellent" },
    { name: "API Routes", path: "routes/", coverage: 81, status: "good" },
    { name: "Components", path: "components/", coverage: 65, status: "warning" },
    { name: "Utilities", path: "utils/", coverage: 94, status: "excellent" },
  ];

  const uncoveredFiles = [
    {
      path: "server/controllers/userController.js",
      lines: "45-52",
      description: "Error handling for password reset",
      code: `} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json({
      message: 'Too many reset attempts'
    });
  }
  // ... rest of error handling`
    },
    {
      path: "client/src/components/UserForm.jsx",
      lines: "78-85",
      description: "Validation for special characters",
      code: `const validateInput = (input) => {
  if (containsSpecialChars(input)) {
    setError('Special characters not allowed');
    return false;
  }
  return true;`
    }
  ];

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-500";
    if (coverage >= 80) return "text-blue-500";
    if (coverage >= 70) return "text-orange-500";
    return "text-red-500";
  };

  const getCoverageStatus = (coverage: number) => {
    if (coverage >= 90) return "excellent";
    if (coverage >= 80) return "good";
    if (coverage >= 70) return "warning";
    return "poor";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Code Coverage</h2>
        <p className="text-gray-600">Detailed code coverage analysis and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getCoverageColor(overallCoverage)}`}>
                {overallCoverage}%
              </div>
              <div className="text-sm text-gray-600">
                {overallCoverage >= 70 ? "Above" : "Below"} 70% target
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Statements</span>
                <div className="flex items-center space-x-2">
                  <Progress value={statementsCoverage} className="w-20" />
                  <span className="text-sm font-medium">{statementsCoverage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Branches</span>
                <div className="flex items-center space-x-2">
                  <Progress value={branchesCoverage} className="w-20" />
                  <span className="text-sm font-medium">{branchesCoverage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Functions</span>
                <div className="flex items-center space-x-2">
                  <Progress value={functionsCoverage} className="w-20" />
                  <span className="text-sm font-medium">{functionsCoverage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lines</span>
                <div className="flex items-center space-x-2">
                  <Progress value={linesCoverage} className="w-20" />
                  <span className="text-sm font-medium">{linesCoverage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coverage by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleCoverage.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(module.status)}
                    <div>
                      <div className="font-medium text-gray-900">{module.name}</div>
                      <div className="text-sm text-gray-500">{module.path}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getCoverageColor(module.coverage)}`}>
                      {module.coverage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{statementsCoverage}%</div>
              <div className="text-sm text-gray-600">Statements</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-500">{branchesCoverage}%</div>
              <div className="text-sm text-gray-600">Branches</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{functionsCoverage}%</div>
              <div className="text-sm text-gray-600">Functions</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-500">{linesCoverage}%</div>
              <div className="text-sm text-gray-600">Lines</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uncovered Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uncoveredFiles.map((file, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{file.path}</div>
                <div className="text-sm text-gray-600 mb-2">
                  Lines {file.lines}: {file.description}
                </div>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  <pre className="text-gray-800 whitespace-pre-wrap">
                    {file.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Improve Branch Coverage</div>
                  <div className="text-sm text-blue-700 mt-1">
                    Current branch coverage is at {branchesCoverage}%. Focus on testing edge cases and error conditions to improve coverage.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-900">Add Component Tests</div>
                  <div className="text-sm text-orange-700 mt-1">
                    Component coverage is below target. Consider adding more React component tests with React Testing Library.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Great Function Coverage</div>
                  <div className="text-sm text-green-700 mt-1">
                    Function coverage is excellent at {functionsCoverage}%. Keep up the good work!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
