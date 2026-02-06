'use client';

import React, { useState } from 'react';
import { Zone } from '@/types/map/zone';
import { ZoneList } from './ZoneList';

import { ZoneActions } from './ZoneActions';
import { DataManagement } from './DataManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/map/ui/card';
import { Badge } from '@/components/map/ui/badge';
import { Button } from '@/components/map/ui/button';
import { Separator } from '@/components/map/ui/separator';
import { Building2, MapPin, Clock, Database, Edit, Trash2, Github, Cloud } from 'lucide-react';
import { cn } from '@/lib/map/utils';
import { config } from '@/lib/map/config';
import { GitHubTokenDialog } from './GitHubTokenDialog';

/**
 * Props for the ZoneManagementPanel component
 */
export interface ZoneManagementPanelProps {
  /** Array of zones to display and manage */
  zones: Zone[];
  /** Currently selected zone */
  selectedZone: Zone | null;
  /** Callback when a zone is selected */
  onZoneSelect: (zone: Zone) => void;
  /** Callback when a zone's company name is updated */
  onCompanyNameUpdate: (zoneId: string, companyName: string) => void;
  /** Callback when a zone is edited */
  onZoneEdit: (zone: Zone) => void;
  /** Callback when a zone is deleted */
  onZoneDelete: (zone: Zone) => void;
  /** Callback when zone status is toggled */
  onZoneStatusToggle: (zone: Zone) => void;
  /** Callback when zones are imported */
  onZonesImport: (zones: Zone[]) => void;
  /** Callback when all zones are cleared */
  onZonesClear: () => void;
  /** Callback when zones are restored from backup */
  onZonesRestore: (zones: Zone[]) => void;
  /** Whether edit mode is enabled */
  isEditModeEnabled?: boolean;
  /** GitHub storage methods */
  setGitHubToken?: (token: string) => void;
  hasGitHubToken?: () => boolean;
  saveToGitHub?: () => Promise<boolean>;
  loadFromGitHub?: () => Promise<boolean>;
  /** Optional className for styling */
  className?: string;
}

/**
 * Main zone management panel component that provides a comprehensive interface
 * for managing zones including list view, company name input, and zone actions
 */
export function ZoneManagementPanel({
  zones,
  selectedZone,
  onZoneSelect,
  onCompanyNameUpdate,
  onZoneEdit,
  onZoneDelete,
  onZoneStatusToggle,
  onZonesImport,
  onZonesClear,
  onZonesRestore,
  isEditModeEnabled = false,
  setGitHubToken,
  hasGitHubToken,
  saveToGitHub,
  loadFromGitHub,
  className
}: ZoneManagementPanelProps) {
  // Debug logging
  React.useEffect(() => {
    console.log('ZoneManagementPanel rendered with:', {
      zonesCount: zones.length,
      selectedZoneId: selectedZone?.id,
      className
    });
  }, [zones.length, selectedZone?.id, className]);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showGitHubTokenDialog, setShowGitHubTokenDialog] = useState(false);
  const [isGitHubSaving, setIsGitHubSaving] = useState(false);

  /**
   * Get zone statistics
   */
  const zoneStats = {
    total: zones.length,
    free: zones.filter(z => z.status === 'free').length,
    occupied: zones.filter(z => z.status === 'occupied').length
  };



  /**
   * Handle zone edit request
   */
  const handleZoneEdit = (zone: Zone) => {
    // Always trigger vertex editing mode
    onZoneEdit(zone);
  };

  /**
   * Handle zone status toggle
   */
  const handleStatusToggle = (zone: Zone) => {
    // Use the shared status toggle handler from parent
    onZoneStatusToggle(zone);
  };

  /**
   * Handle GitHub token submission
   */
  const handleGitHubTokenSubmit = (token: string) => {
    if (setGitHubToken) {
      setGitHubToken(token);
    }
  };

  /**
   * Handle save to GitHub
   */
  const handleSaveToGitHub = async () => {
    if (!saveToGitHub) return;
    
    if (!hasGitHubToken || !hasGitHubToken()) {
      setShowGitHubTokenDialog(true);
      return;
    }

    setIsGitHubSaving(true);
    try {
      const success = await saveToGitHub();
      if (success) {
        alert('Zones successfully saved to GitHub!');
      } else {
        alert('Failed to save zones to GitHub. Check console for details.');
      }
    } finally {
      setIsGitHubSaving(false);
    }
  };

  /**
   * Handle load from GitHub
   */
  const handleLoadFromGitHub = async () => {
    if (!loadFromGitHub) return;
    
    const confirmed = confirm('This will replace all current zones with data from GitHub. Continue?');
    if (!confirmed) return;

    try {
      const success = await loadFromGitHub();
      if (success) {
        alert('Zones successfully loaded from GitHub!');
      } else {
        alert('Failed to load zones from GitHub. Check console for details.');
      }
    } catch (error) {
      console.error('Error loading from GitHub:', error);
      alert('Error loading from GitHub. Check console for details.');
    }
  };



  return (
    <div 
      className={cn("flex flex-col h-full bg-white", className)}
      role="complementary"
      aria-label="Zone management panel"
    >
      {/* Statistics Overview - Fixed at top */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{zoneStats.total}</div>
            <div className="text-sm text-gray-600">Всего зон</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{zoneStats.occupied}</div>
            <div className="text-sm text-gray-600">Занято</div>
          </div>
        </div>
        
        {/* Quick Actions Row */}
        <div className="space-y-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataManagement(!showDataManagement)}
            className="w-full"
          >
            <Database className="h-4 w-4 mr-2" />
            {showDataManagement ? 'Скрыть данные' : 'Управление данными'}
          </Button>
          
          {/* GitHub Storage Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToGitHub}
              disabled={isGitHubSaving}
              className="text-xs"
            >
              <Cloud className="h-3 w-3 mr-1" />
              {isGitHubSaving ? 'Сохранение...' : 'Сохранить на сервер'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadFromGitHub}
              className="text-xs"
            >
              <Github className="h-3 w-3 mr-1" />
              Загрузить с сервера
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management Section - Collapsible */}
      {showDataManagement && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="p-4">
            <DataManagement
              zones={zones}
              onImport={onZonesImport}
              onClearAll={onZonesClear}
              onRestore={onZonesRestore}
            />
          </div>
        </div>
      )}



      {/* Zone List - Main scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Кабинеты</h3>
            {zones.length > 0 && (
              <span className="text-xs text-gray-500">{zones.length} всего</span>
            )}
          </div>
          <ZoneList
            zones={zones}
            selectedZone={selectedZone}
            onZoneSelect={onZoneSelect}
          />
        </div>
      </div>   
      {/* Selected Zone Details - Fixed at bottom */}
      {selectedZone && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-4">
            <div className="space-y-4">
              {/* Zone Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Выбранная зона</h4>
                <Badge 
                  variant="outline"
                  className={selectedZone.status === 'free' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'}
                >
                  {selectedZone.status === 'free' ? 'Свободна' : 'Занята'}
                </Badge>
              </div>
              
              {/* Company name for occupied zones */}
              {selectedZone.status === 'occupied' && selectedZone.companyName && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{selectedZone.companyName}</span>
                  </div>
                </div>
              )}
              
              {/* Zone Info */}
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-900">Зона {zones.findIndex(z => z.id === selectedZone.id) + 1}</div>
                <div className="text-gray-600 text-xs">Позиция</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant={selectedZone.status === 'free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusToggle(selectedZone)}
                  className="w-full"
                >
                  {selectedZone.status === 'free' ? 'Отметить как занятую' : 'Отметить как свободную'}
                </Button>
                
                {(config.features.vertexEditing || config.features.zoneDeletion) && (
                  <div className={cn("grid gap-2", (config.features.vertexEditing && config.features.zoneDeletion) ? "grid-cols-2" : "grid-cols-1")}>
                    {config.features.vertexEditing && (
                    <Button
                      variant={isEditModeEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleZoneEdit(selectedZone)}
                      className={cn("text-xs", isEditModeEnabled && "bg-amber-600 hover:bg-amber-700 text-white")}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      {isEditModeEnabled ? 'Выйти из редактирования' : 'Редактировать'}
                    </Button>
                  )}
                  {config.features.zoneDeletion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onZoneDelete(selectedZone)}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Удалить
                    </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}