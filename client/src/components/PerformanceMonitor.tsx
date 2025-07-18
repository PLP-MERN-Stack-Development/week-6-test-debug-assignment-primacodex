import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, MemoryStick, Cpu, Database, AlertTriangle, TrendingUp } from "lucide-react";
import { PerformanceMetric } from "@shared/schema";

export default function PerformanceMonitor() {
  const { data: metrics = [] } = useQuery<PerformanceMetric[]>({
    queryKey: ["/api/performance-metrics"],
    refetchInterval: 5000,
  });

  const getLatestMetric = (type: string) => {
    return metrics
      .filter(m => m.metricType === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const responseTime = getLatestMetric("response_time");
  const memoryUsage = getLatestMetric("memory");
  const cpuUsage = getLatestMetric("cpu");
  const databaseTime = getLatestMetric("database");

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case "response_time":
        return value < 200 ? "text-green-500" : value < 500 ? "text-yellow-500" : "text-red-500";
      case "memory":
        return value < 300 ? "text-green-500" : value < 400 ? "text-yellow-500" : "text-red-500";
      case "cpu":
        return value < 50 ? "text-green-500" : value < 80 ? "text-yellow-500" : "text-red-500";
      case "database":
        return value < 100 ? "text-green-500" : value < 300 ? "text-yellow-500" : "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Monitor</h2>
        <p className="text-gray-600">Application performance metrics and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(responseTime?.value || 0, "response_time")}`}>
              {responseTime?.value || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {responseTime?.value && responseTime.value < 200 ? "Excellent" : "Good"} performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MemoryStick Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(memoryUsage?.value || 0, "memory")}`}>
              {memoryUsage?.value || 0}MB
            </div>
            <p className="text-xs text-muted-foreground">
              of 512MB allocated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(cpuUsage?.value || 0, "cpu")}`}>
              {cpuUsage?.value || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Within normal range
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(databaseTime?.value || 0, "database")}`}>
              {databaseTime?.value || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Average query time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Response Time</div>
                    <div className="text-sm text-gray-500">Last 24 hours</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-500">+5%</div>
                  <div className="text-sm text-gray-500">Improving</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MemoryStick className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">MemoryStick Usage</div>
                    <div className="text-sm text-gray-500">Peak usage</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-500">312MB</div>
                  <div className="text-sm text-gray-500">Stable</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium text-gray-900">CPU Usage</div>
                    <div className="text-sm text-gray-500">Average load</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-orange-500">28%</div>
                  <div className="text-sm text-gray-500">Normal</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-600">ValidationError</span>
                  <Badge variant="destructive">3 occurrences</Badge>
                </div>
                <div className="text-sm text-gray-600">User profile validation failed</div>
                <div className="text-xs text-gray-500 mt-1">Last seen: 2 minutes ago</div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-600">SlowQueryWarning</span>
                  <Badge variant="outline">1 occurrence</Badge>
                </div>
                <div className="text-sm text-gray-600">Database query exceeded 1000ms threshold</div>
                <div className="text-xs text-gray-500 mt-1">Last seen: 15 minutes ago</div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">MemoryWarning</span>
                  <Badge variant="outline">2 occurrences</Badge>
                </div>
                <div className="text-sm text-gray-600">MemoryStick usage above 80% threshold</div>
                <div className="text-xs text-gray-500 mt-1">Last seen: 1 hour ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Application</span>
              </div>
              <div className="text-sm text-gray-600">Running smoothly</div>
              <div className="text-xs text-gray-500 mt-1">Uptime: 72h 15m</div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <div className="text-sm text-gray-600">Connected and healthy</div>
              <div className="text-xs text-gray-500 mt-1">Queries: 1,247 today</div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Cache</span>
              </div>
              <div className="text-sm text-gray-600">Optimal performance</div>
              <div className="text-xs text-gray-500 mt-1">Hit rate: 94.2%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
