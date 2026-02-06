'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/map/utils';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Loading message to display */
  message?: string;
  /** Additional className for styling */
  className?: string;
  /** Whether to show as fullscreen overlay */
  fullscreen?: boolean;
}

/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  className,
  fullscreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      fullscreen ? "min-h-screen" : "p-8",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-blue-600",
        sizeClasses[size]
      )} />
      {message && (
        <p className={cn(
          "text-gray-600 font-medium",
          textSizeClasses[size]
        )}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Loading state for canvas area
 */
export function CanvasLoading({ width = 800, height = 600 }: { width?: number; height?: number }) {
  return (
    <div 
      className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
      style={{ width, height }}
    >
      <LoadingSpinner message="Loading floor plan..." />
    </div>
  );
}

/**
 * Loading state for zone list
 */
export function ZoneListLoading() {
  return (
    <div className="p-4 space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg p-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}