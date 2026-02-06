'use client';

import React, { useState, useEffect } from 'react';
import { Zone } from '@/types/map/zone';
import { validateCompanyName } from '@/lib/map/zoneUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/map/ui/dialog';
import { Button } from '@/components/map/ui/button';
import { Input } from '@/components/map/ui/input';
import { cn } from '@/lib/map/utils';

/**
 * Props for the CompanyNameDialog component
 */
export interface CompanyNameDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Zone being edited (null for new zone) */
  zone: Zone | null;
  /** Callback when company name is submitted */
  onSubmit: (companyName: string) => void;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
}

/**
 * Dialog component for entering and editing company names for occupied zones
 * Provides real-time validation and handles both new zone creation and editing
 */
export function CompanyNameDialog({
  open,
  onClose,
  zone,
  onSubmit,
  isSubmitting = false
}: CompanyNameDialogProps) {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Reset form when dialog opens/closes or zone changes
  useEffect(() => {
    if (open) {
      setCompanyName(zone?.companyName || '');
      setError(null);
      setTouched(false);
    } else {
      setCompanyName('');
      setError(null);
      setTouched(false);
    }
  }, [open, zone]);

  /**
   * Validate company name in real-time
   */
  useEffect(() => {
    if (!touched && !companyName) return;

    const validation = validateCompanyName(companyName);
    setError(validation.isValid ? null : validation.error || 'Недопустимое название компании');
  }, [companyName, touched]);

  /**
   * Handle input change with real-time validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyName(value);
    
    if (!touched) {
      setTouched(true);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!touched) {
      setTouched(true);
    }

    const validation = validateCompanyName(companyName);
    
    if (!validation.isValid) {
      setError(validation.error || 'Недопустимое название компании');
      return;
    }

    onSubmit(companyName.trim());
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  /**
   * Handle key down events
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  };

  const isValid = !error && companyName.trim().length > 0;
  const isEditing = zone !== null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Изменить название компании' : 'Введите название компании'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Обновите название компании для этой занятой зоны.'
                : 'Введите название компании, чтобы отметить эту зону как занятую.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="company-name" className="text-sm font-medium">
                Название компании
              </label>
              <Input
                id="company-name"
                type="text"
                placeholder="Введите название компании..."
                value={companyName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={cn(
                  error && touched && "border-destructive focus-visible:border-destructive"
                )}
                autoFocus
                maxLength={50}
              />
              
              {/* Character count */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {error && touched ? (
                    <span className="text-destructive">{error}</span>
                  ) : (
                    'Разрешены буквы, цифры, пробелы и дефисы'
                  )}
                </span>
                <span className={cn(
                  companyName.length > 45 && "text-warning",
                  companyName.length >= 50 && "text-destructive"
                )}>
                  {companyName.length}/50
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditing ? 'Обновление...' : 'Сохранение...'}
                </>
              ) : (
                isEditing ? 'Обновить' : 'Сохранить'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}