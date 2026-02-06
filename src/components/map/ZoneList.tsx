'use client';

import React from 'react';
import { Zone, ZoneStatus } from '@/types/map/zone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/map/ui/card';
import { Badge } from '@/components/map/ui/badge';
import { ScrollArea } from '@/components/map/ui/scroll-area';
import { cn } from '@/lib/map/utils';

/**
 * Props for the ZoneList component
 */
export interface ZoneListProps {
  /** Array of zones to display */
  zones: Zone[];
  /** Currently selected zone */
  selectedZone: Zone | null;
  /** Callback when a zone is selected from the list */
  onZoneSelect: (zone: Zone) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * Zone list component that displays zones in a scrollable list using shadcn/ui Card components
 * Shows zone status badges and company names with zone selection functionality
 */
export function ZoneList({
  zones,
  selectedZone,
  onZoneSelect,
  className
}: ZoneListProps) {
  /**
   * Get badge styling based on zone status
   */
  const getStatusBadgeClass = (status: ZoneStatus) => {
    switch (status) {
      case 'free':
        return 'bg-green-500 text-white border-green-500';
      case 'occupied':
        return 'bg-red-500 text-white border-red-500';
      default:
        return 'bg-gray-500 text-white border-gray-500';
    }
  };

  /**
   * Get status display text
   */
  const getStatusText = (status: ZoneStatus) => {
    switch (status) {
      case 'free':
        return 'Свободна';
      case 'occupied':
        return 'Занята';
      default:
        return 'Неизвестно';
    }
  };



  /**
   * Generate zone display name
   */
  const getZoneDisplayName = (zone: Zone, index: number) => {
    return `Кабинет ${index + 1}`;
  };

  if (zones.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} role="status">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Зоны еще не созданы</p>
          <p className="text-muted-foreground text-xs mt-1">
            Нажмите на план этажа, чтобы начать создание зон
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <ScrollArea className="h-full">
        <div 
          className="space-y-3 p-4" 
          role="list" 
          aria-label="Zone list"
        >
          {zones.map((zone, index) => {
            const isSelected = selectedZone?.id === zone.id;
            const zoneName = getZoneDisplayName(zone, index);
            
            return (
              <Card
                key={zone.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected && "ring-2 ring-primary ring-offset-2 bg-accent/50"
                )}
                onClick={() => onZoneSelect(zone)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onZoneSelect(zone);
                  }
                }}
                tabIndex={0}
                role="listitem button"
                aria-label={`${zoneName}, ${getStatusText(zone.status)}${zone.companyName ? `, ${zone.companyName}` : ''}`}
                aria-pressed={isSelected}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {getZoneDisplayName(zone, index)}
                    </CardTitle>
                    <Badge 
                      variant="outline"
                      className={getStatusBadgeClass(zone.status)}
                      aria-label={`Status: ${getStatusText(zone.status)}`}
                    >
                      {getStatusText(zone.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Company name for occupied zones */}
                  {zone.status === 'occupied' && zone.companyName && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Компания</p>
                      <p className="text-sm font-medium text-foreground">
                        {zone.companyName}
                      </p>
                    </div>
                  )}
                  

                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}