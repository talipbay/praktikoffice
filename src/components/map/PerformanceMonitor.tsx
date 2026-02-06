'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Zone } from '@/types/map/zone';
import { 
  PerformanceBenchmark, 
  BrowserPerformanceDetector, 
  MemoryMonitor,
  PerformanceTestResult 
} from '@/lib/map/performanceTesting';
import { Button } from '@/components/map/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/map/ui/card';
import { Badge } from '@/components/map/ui/badge';
import { ScrollArea } from '@/components/map/ui/scroll-area';
import { Separator } from '@/components/map/ui/separator';
import { Progress } from '@/components/map/ui/progress';

/**
 * Props for the PerformanceMonitor component
 */
export interface PerformanceMonitorProps {
  /** Current zones for testing */
  zones: Zone[];
  /** Whether to show the monitor (development only) */
  show?: boolean;
}

/**
 * Performance monitoring and testing component for development
 */
export function PerformanceMonitor({ zones, show = process.env.NODE_ENV === 'development' }: PerformanceMonitorProps) {
  const [benchmark] = useState(() => new PerformanceBenchmark());
  const [memoryMonitor] = useState(() => new MemoryMonitor());
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<PerformanceTestResult[]>([]);
  const [browserCapabilities, setBrowserCapabilities] = useState(BrowserPerformanceDetector.detectCapabilities());
  const [memoryStats, setMemoryStats] = useState(memoryMonitor.getStats());
  const [isMonitoringMemory, setIsMonitoringMemory] = useState(false);

  // Update memory stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryStats(memoryMonitor.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [memoryMonitor]);

  /**
   * Run performance tests
   */
  const runPerformanceTests = useCallback(async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    benchmark.clearResults();

    try {
      // Test with current zones if available
      if (zones.length > 0) {
        setTestProgress(20);
        await benchmark.testHitDetection(zones, 1000);
        
        setTestProgress(40);
        await benchmark.testCanvasRendering(zones, 50);
        
        setTestProgress(60);
        await benchmark.testStorageOperations(zones, 50);
      }

      // Test zone creation with different counts
      setTestProgress(80);
      await benchmark.testZoneCreation(100);

      setTestProgress(100);
      setTestResults(benchmark.getResults());
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setIsRunningTests(false);
      setTestProgress(0);
    }
  }, [zones, benchmark]);

  /**
   * Run full test suite
   */
  const runFullTestSuite = useCallback(async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    benchmark.clearResults();

    try {
      const results = await benchmark.runFullTestSuite();
      setTestResults(results);
    } catch (error) {
      console.error('Full test suite failed:', error);
    } finally {
      setIsRunningTests(false);
      setTestProgress(0);
    }
  }, [benchmark]);

  /**
   * Toggle memory monitoring
   */
  const toggleMemoryMonitoring = useCallback(() => {
    if (isMonitoringMemory) {
      memoryMonitor.stop();
      setIsMonitoringMemory(false);
    } else {
      memoryMonitor.start(1000);
      setIsMonitoringMemory(true);
    }
  }, [isMonitoringMemory, memoryMonitor]);

  /**
   * Clear test results
   */
  const clearResults = useCallback(() => {
    benchmark.clearResults();
    setTestResults([]);
  }, [benchmark]);

  /**
   * Format memory size
   */
  const formatMemorySize = (bytes: number): string => {
    if (bytes === 0) return 'N/A';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  /**
   * Get performance level color
   */
  const getPerformanceColor = (level: string): string => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!show) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Performance Monitor
          <Badge variant="outline">Development</Badge>
        </CardTitle>
        <CardDescription>
          Monitor and test application performance characteristics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Browser Capabilities */}
        <div>
          <h4 className="text-sm font-medium mb-3">Browser Capabilities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-lg font-semibold ${getPerformanceColor(browserCapabilities.estimatedPerformance)}`}>
                {browserCapabilities.estimatedPerformance.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500">Performance</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">
                {browserCapabilities.devicePixelRatio}x
              </div>
              <div className="text-xs text-gray-500">Pixel Ratio</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">
                {navigator.hardwareConcurrency || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">CPU Cores</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">
                {zones.length}
              </div>
              <div className="text-xs text-gray-500">Current Zones</div>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={browserCapabilities.canvas2d ? "default" : "secondary"}>
              Canvas 2D: {browserCapabilities.canvas2d ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={browserCapabilities.localStorage ? "default" : "secondary"}>
              LocalStorage: {browserCapabilities.localStorage ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={browserCapabilities.requestAnimationFrame ? "default" : "secondary"}>
              RAF: {browserCapabilities.requestAnimationFrame ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={browserCapabilities.memory ? "default" : "secondary"}>
              Memory API: {browserCapabilities.memory ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Memory Monitoring */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Memory Usage</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleMemoryMonitoring}
            >
              {isMonitoringMemory ? 'Stop' : 'Start'} Monitoring
            </Button>
          </div>
          
          {browserCapabilities.memory ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatMemorySize(memoryStats.current.used)}
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatMemorySize(memoryStats.peak.used)}
                </div>
                <div className="text-xs text-gray-500">Peak</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatMemorySize(memoryStats.average.used)}
                </div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              Memory API not available in this browser
            </div>
          )}
        </div>

        <Separator />

        {/* Performance Testing */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Performance Testing</h4>
            <div className="space-x-2">
              <Button
                size="sm"
                onClick={runPerformanceTests}
                disabled={isRunningTests}
              >
                Quick Test
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={runFullTestSuite}
                disabled={isRunningTests}
              >
                Full Suite
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearResults}
                disabled={isRunningTests || testResults.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
          
          {isRunningTests && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Running tests...</span>
                <span className="text-sm">{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}
          
          {testResults.length > 0 && (
            <ScrollArea className="h-64 border rounded p-3">
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{result.testName}</span>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? 'Pass' : 'Fail'}
                      </Badge>
                    </div>
                    
                    {result.success ? (
                      <div className="text-xs text-gray-600 mt-1 space-y-1">
                        <div>Duration: {result.duration.toFixed(2)}ms</div>
                        <div>Operations: {result.operations.toLocaleString()}</div>
                        <div>Ops/sec: {result.operationsPerSecond.toFixed(2)}</div>
                        {result.memoryUsage && (
                          <div>Memory: {formatMemorySize(result.memoryUsage.used)}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Recommendations */}
        {testResults.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">Recommendations</h4>
              <div className="text-sm text-gray-600 space-y-2">
                {(() => {
                  const settings = BrowserPerformanceDetector.getRecommendedSettings();
                  const hitDetectionTests = testResults.filter(r => r.testName.includes('Hit Detection') && r.success);
                  const avgHitDetectionOps = hitDetectionTests.length > 0 
                    ? hitDetectionTests.reduce((sum, r) => sum + r.operationsPerSecond, 0) / hitDetectionTests.length 
                    : 0;

                  const recommendations = [];

                  if (avgHitDetectionOps < 1000) {
                    recommendations.push('Consider limiting the number of zones for better performance');
                  }

                  if (browserCapabilities.estimatedPerformance === 'low') {
                    recommendations.push('Disable animations and use lower render quality');
                  }

                  if (memoryStats.peak.used > 50 * 1024 * 1024) { // 50MB
                    recommendations.push('Monitor memory usage with large numbers of zones');
                  }

                  recommendations.push(`Recommended max zones: ${settings.maxZones}`);
                  recommendations.push(`Recommended debounce delay: ${settings.debounceDelay}ms`);

                  return recommendations.map((rec, index) => (
                    <div key={index}>• {rec}</div>
                  ));
                })()}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}