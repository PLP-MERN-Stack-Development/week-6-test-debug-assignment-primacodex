import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { TestSuite } from "@shared/schema";

interface TestSuiteCardProps {
  suite: TestSuite;
  onRun: (suiteId: number) => void;
}

export default function TestSuiteCard({ suite, onRun }: TestSuiteCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "running": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "running": return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{suite.name}</CardTitle>
          <Badge className={getStatusColor(suite.status)}>
            {suite.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900">Total</div>
              <div className="text-2xl font-bold">{suite.testCount}</div>
            </div>
            <div>
              <div className="font-medium text-green-600">Passing</div>
              <div className="text-2xl font-bold text-green-600">{suite.passingCount}</div>
            </div>
            <div>
              <div className="font-medium text-red-600">Failing</div>
              <div className="text-2xl font-bold text-red-600">{suite.failingCount}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Coverage: {suite.coverage}%
            </div>
            <div className="text-sm text-gray-600">
              Duration: {suite.duration ? `${Math.round(suite.duration / 1000)}s` : "—"}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(suite.status)}
              <span className="text-sm text-gray-600">
                {suite.updatedAt ? new Date(suite.updatedAt).toLocaleString() : "Never run"}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => onRun(suite.id)}
              disabled={suite.status === "running"}
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
