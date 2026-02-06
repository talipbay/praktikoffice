'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Zone } from '@/types/map/zone';
import { 
  exportZonesToJSON, 
  downloadZonesAsJSON, 
  importZonesFromFile, 
  ImportValidationResult,
  saveBackupToStorage,
  getAvailableBackups,
  restoreFromBackup
} from '@/lib/map/dataExportImport';
import { Button } from '@/components/map/ui/button';
import { Input } from '@/components/map/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/map/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/map/ui/dialog';
import { Badge } from '@/components/map/ui/badge';
import { ScrollArea } from '@/components/map/ui/scroll-area';
import { Separator } from '@/components/map/ui/separator';

/**
 * Props for the DataManagement component
 */
export interface DataManagementProps {
  /** Current zones */
  zones: Zone[];
  /** Callback when zones are imported */
  onImport: (zones: Zone[]) => void;
  /** Callback when all zones are cleared */
  onClearAll: () => void;
  /** Callback when zones are reset to a backup */
  onRestore: (zones: Zone[]) => void;
}

/**
 * Data management component for export, import, and backup operations
 */
export function DataManagement({ zones, onImport, onClearAll, onRestore }: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportValidationResult | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [availableBackups, setAvailableBackups] = useState<Array<{ key: string; date: Date; zoneCount: number }>>([]);

  /**
   * Handle export to JSON file
   */
  const handleExport = useCallback(() => {
    try {
      downloadZonesAsJSON(zones);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Не удалось экспортировать зоны. Попробуйте еще раз.');
    }
  }, [zones]);

  /**
   * Handle file selection for import
   */
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importZonesFromFile(file);
      setImportResult(result);
      setShowImportDialog(true);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Не удалось импортировать зоны. Проверьте формат файла и попробуйте еще раз.');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  /**
   * Confirm import of validated zones
   */
  const handleConfirmImport = useCallback(() => {
    if (importResult && importResult.isValid && importResult.validZones.length > 0) {
      onImport(importResult.validZones);
      setShowImportDialog(false);
      setImportResult(null);
    }
  }, [importResult, onImport]);

  /**
   * Handle creating a manual backup
   */
  const handleCreateBackup = useCallback(() => {
    try {
      saveBackupToStorage(zones);
      alert('Резервная копия успешно создана!');
      // Refresh backup list
      setAvailableBackups(getAvailableBackups());
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Не удалось создать резервную копию. Попробуйте еще раз.');
    }
  }, [zones]);

  /**
   * Handle restoring from backup
   */
  const handleRestoreBackup = useCallback((backupKey: string) => {
    try {
      const result = restoreFromBackup(backupKey);
      if (result.isValid && result.validZones.length > 0) {
        onRestore(result.validZones);
        setShowBackupDialog(false);
        alert(`Успешно восстановлено ${result.validZones.length} зон из резервной копии.`);
      } else {
        alert('Не удалось восстановить резервную копию: ' + result.errors.join(', '));
      }
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Не удалось восстановить резервную копию. Попробуйте еще раз.');
    }
  }, [onRestore]);

  /**
   * Load available backups when dialog opens
   */
  const handleOpenBackupDialog = useCallback(() => {
    setAvailableBackups(getAvailableBackups());
    setShowBackupDialog(true);
  }, []);

  /**
   * Handle clearing all zones with confirmation
   */
  const handleClearAll = useCallback(() => {
    if (zones.length === 0) {
      alert('Нет зон для очистки.');
      return;
    }

    const confirmed = window.confirm(
      `Вы уверены, что хотите удалить все ${zones.length} зон? Это действие нельзя отменить.`
    );

    if (confirmed) {
      // Create automatic backup before clearing
      try {
        saveBackupToStorage(zones);
      } catch (error) {
        console.warn('Failed to create backup before clearing:', error);
      }
      
      onClearAll();
    }
  }, [zones, onClearAll]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Управление данными</CardTitle>
        <CardDescription>
          Экспорт, импорт, резервное копирование и управление данными зон
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Экспорт данных</h4>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleExport}
              disabled={zones.length === 0}
              variant="outline"
            >
              Экспорт в JSON
            </Button>
            <span className="text-sm text-gray-500">
              {zones.length} зон
            </span>
          </div>
        </div>

        <Separator />

        {/* Import Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Импорт данных</h4>
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="flex-1"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              variant="outline"
            >
              {isImporting ? 'Импорт...' : 'Выбрать файл'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Backup Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Резервное копирование</h4>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateBackup}
              disabled={zones.length === 0}
              variant="outline"
            >
              Создать резервную копию
            </Button>
            <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleOpenBackupDialog}
                  variant="outline"
                >
                  Просмотр резервных копий
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Доступные резервные копии</DialogTitle>
                  <DialogDescription>
                    Восстановите зоны из предыдущей резервной копии
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-60">
                  {availableBackups.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Резервные копии недоступны
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availableBackups.map((backup) => (
                        <div 
                          key={backup.key}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {backup.date.toLocaleDateString()} {backup.date.toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {backup.zoneCount} зон
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRestoreBackup(backup.key)}
                            variant="outline"
                          >
                            Восстановить
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Bulk Operations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Массовые операции</h4>
          <Button 
            onClick={handleClearAll}
            disabled={zones.length === 0}
            variant="destructive"
          >
            Очистить все зоны
          </Button>
        </div>

        {/* Import Result Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Результаты импорта</DialogTitle>
              <DialogDescription>
                Просмотрите импортированные данные зон перед применением изменений
              </DialogDescription>
            </DialogHeader>
            
            {importResult && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center space-x-2">
                  <Badge variant={importResult.isValid ? "default" : "destructive"}>
                    {importResult.isValid ? 'Действительный' : 'Недействительный'}
                  </Badge>
                  <span className="text-sm">
                    {importResult.validZones.length} действительных зон найдено
                  </span>
                </div>

                {/* Errors */}
                {importResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-red-600">Ошибки:</h5>
                    <ScrollArea className="max-h-20">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">• {error}</p>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {/* Warnings */}
                {importResult.warnings.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-yellow-600">Предупреждения:</h5>
                    <ScrollArea className="max-h-20">
                      {importResult.warnings.map((warning, index) => (
                        <p key={index} className="text-sm text-yellow-600">• {warning}</p>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {/* Invalid Zones */}
                {importResult.invalidZones.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium text-red-600">
                      Недействительные зоны ({importResult.invalidZones.length}):
                    </h5>
                    <ScrollArea className="max-h-32">
                      {importResult.invalidZones.map((invalid, index) => (
                        <div key={index} className="text-sm text-red-600 mb-1">
                          <p>Зона {index + 1}: {invalid.errors.join(', ')}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowImportDialog(false)}
                  >
                    Отмена
                  </Button>
                  {importResult.isValid && importResult.validZones.length > 0 && (
                    <Button onClick={handleConfirmImport}>
                      Импортировать {importResult.validZones.length} зон
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}