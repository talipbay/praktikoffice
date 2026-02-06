'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/map/ui/card';
import { Button } from '@/components/map/ui/button';

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
}

/**
 * Browser compatibility checker component
 * Shows fallback UI for unsupported browsers
 */
export function BrowserCompatibility({ children }: { children: React.ReactNode }) {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBrowserSupport = () => {
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = '0';
      let isSupported = true;

      // Detect browser
      if (userAgent.includes('Chrome')) {
        browserName = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        browserVersion = match ? match[1] : '0';
        isSupported = parseInt(browserVersion) >= 64;
      } else if (userAgent.includes('Firefox')) {
        browserName = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        browserVersion = match ? match[1] : '0';
        isSupported = parseInt(browserVersion) >= 67;
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserName = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        browserVersion = match ? match[1] : '0';
        isSupported = parseInt(browserVersion) >= 12;
      } else if (userAgent.includes('Edge')) {
        browserName = 'Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        browserVersion = match ? match[1] : '0';
        isSupported = parseInt(browserVersion) >= 79;
      } else {
        isSupported = false;
      }

      // Check for required features
      const hasCanvas = !!document.createElement('canvas').getContext;
      const hasLocalStorage = typeof Storage !== 'undefined';
      const hasES6 = typeof Symbol !== 'undefined';

      if (!hasCanvas || !hasLocalStorage || !hasES6) {
        isSupported = false;
      }

      setBrowserInfo({
        name: browserName,
        version: browserVersion,
        isSupported
      });
      setIsChecking(false);
    };

    checkBrowserSupport();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking browser compatibility...</p>
        </div>
      </div>
    );
  }

  if (!browserInfo?.isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-900">Browser Not Supported</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              The Zone Management application requires a modern browser with HTML5 Canvas support.
            </p>
            
            {browserInfo && (
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p><strong>Current Browser:</strong> {browserInfo.name} {browserInfo.version}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Supported Browsers:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Chrome 64 or later</li>
                <li>• Firefox 67 or later</li>
                <li>• Safari 12 or later</li>
                <li>• Edge 79 or later</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <a 
                  href="https://www.google.com/chrome/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Chrome
                </a>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Check Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}