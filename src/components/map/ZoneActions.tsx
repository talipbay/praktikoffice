'use client';

import React, { useState } from 'react';
import { Zone } from '@/types/map/zone';
import { Button } from '@/components/map/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/map/ui/dialog';
import { Trash2, Edit, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/map/utils';

/**
 * Props for the ZoneActions component
 */
export interface ZoneActionsProps {
  /** Zone to perform actions on */
  zone: Zone;
  /** Callback when edit is requested */
  onEdit: (zone: Zone) => void;
  /** Callback when delete is requested */
  onDelete: (zone: Zone) => void;
  /** Whether actions are currently being processed */
  isProcessing?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Layout variant */
  variant?: 'horizontal' | 'vertical' | 'dropdown';
}

/**
 * Props for the DeleteConfirmationDialog component
 */
export interface DeleteConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Zone being deleted */
  zone: Zone;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback to confirm deletion */
  onConfirm: () => void;
  /** Whether deletion is in progress */
  isDeleting?: boolean;
}

/**
 * Confirmation dialog for zone deletion
 */
function DeleteConfirmationDialog({
  open,
  zone,
  onClose,
  onConfirm,
  isDeleting = false
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Zone
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this zone? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize">{zone.status}</span>
            </div>
            
            {zone.status === 'occupied' && zone.companyName && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{zone.companyName}</span>
              </div>
            )}
            

          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Zone
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Zone actions component with edit and delete buttons
 * Provides confirmation dialogs for destructive actions and feedback during operations
 */
export function ZoneActions({
  zone,
  onEdit,
  onDelete,
  isProcessing = false,
  className,
  variant = 'horizontal'
}: ZoneActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handle edit button click
   */
  const handleEdit = () => {
    if (!isProcessing) {
      onEdit(zone);
    }
  };

  /**
   * Handle delete button click
   */
  const handleDelete = () => {
    if (!isProcessing) {
      setShowDeleteDialog(true);
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(zone);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting zone:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle delete dialog close
   */
  const handleDeleteDialogClose = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  const buttonSize = variant === 'dropdown' ? 'sm' : 'default';
  const buttonClass = cn(
    "transition-all duration-200",
    variant === 'dropdown' && "w-full justify-start"
  );

  const containerClass = cn(
    "flex gap-2",
    variant === 'vertical' && "flex-col",
    variant === 'horizontal' && "flex-row",
    variant === 'dropdown' && "flex-col w-full",
    className
  );

  return (
    <>
      <div className={containerClass}>
        {/* Edit Button */}
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleEdit}
          disabled={isProcessing}
          className={buttonClass}
          aria-label="Edit zone"
        >
          <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
          Edit Zone
        </Button>

        {/* Delete Button */}
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleDelete}
          disabled={isProcessing}
          className={cn(
            buttonClass,
            "text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          )}
          aria-label={`Delete zone${zone.companyName ? ` occupied by ${zone.companyName}` : ''}`}
        >
          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
          Delete Zone
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        zone={zone}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
}