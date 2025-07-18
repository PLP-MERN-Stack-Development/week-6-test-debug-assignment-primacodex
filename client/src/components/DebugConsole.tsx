import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Terminal } from "lucide-react";
import { DebugLog } from "@shared/schema";

export default function DebugConsole() {
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const { data: logs = [], refetch } = useQuery<DebugLog[]>({
    queryKey: ["/api/debug-logs"],
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  const filteredLogs = logs.filter(log => 
    filter === "all" || log.level === filter
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warn": return "text-yellow-400";
      case "info": return "text-blue-400";
      case "debug": return "text-white";
      default: return "text-gray-400";
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-100 text-red-800";
      case "warn": return "bg-yellow-100 text-yellow-800";
      case "info": return "bg-blue-100 text-blue-800";
      case "debug": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };

  const handleClear = () => {
    // In a real app, this would clear the logs
    console.log("Clear logs");
  };

  const handleExport = () => {
    const logData = filteredLogs.map(log => 
      `[${formatTimestamp(log.createdAt)}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Debug Console</h2>
        <p className="text-gray-600">Real-time logging and debugging information</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "error" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("error")}
            >
              Errors
            </Button>
            <Button
              variant={filter === "warn" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("warn")}
            >
              Warnings
            </Button>
            <Button
              variant={filter === "info" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("info")}
            >
              Info
            </Button>
            <Button
              variant={filter === "debug" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("debug")}
            >
              Debug
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Auto-scroll</span>
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
          </div>
        </div>
      </div>

      <Card className="h-96">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <span>Console Output</span>
            </CardTitle>
            <Badge variant="outline">
              {filteredLogs.length} entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-full overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm p-4">
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3">
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    [{formatTimestamp(log.createdAt)}]
                  </span>
                  <Badge className={`${getLevelBadgeColor(log.level)} text-xs`}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className={getLevelColor(log.level)}>
                    {log.message}
                  </span>
                  {log.source && (
                    <span className="text-gray-500 text-xs">
                      ({log.source})
                    </span>
                  )}
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No logs to display
                </div>
              )}
              <div className="animate-pulse">_</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
