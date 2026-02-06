'use client';

import React, { useEffect, useRef } from 'react';
import { Zone } from '@/types/map/zone';
import { Button } from '@/components/map/ui/button';
import { Edit, Trash2, ToggleLeft, ToggleRight, Building2 } from 'lucide-react';
import { config } from '@/lib/map/config';

/**
 * Props for the ZoneContextMenu component
 */
export interface ZoneContextMenuProps {
  /** Zone that was right-clicked */
  zone: Zone;
  /** Position where the menu should appear */
  position: { x: number; y: number };
  /** Whether the menu is visible */
  isVisible: boolean;
  /** Callback to close the menu */
  onClose: () => void;
  /** Callback when edit is requested */
  onEdit: (zone: Zone) => void;
  /** Callback when delete is requested */
  onDelete: (zone: Zone) => void;
  /** Callback when status toggle is requested */
  onToggleStatus: (zone: Zone) => void;
}

/**
 * Context menu component for zone right-click actions
 */
export function ZoneContextMenu({
  zone,
  position,
  isVisible,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}: ZoneContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  // Adjust menu position to stay within viewport
  const getMenuStyle = () => {
    if (!isVisible) return { display: 'none' };

    const menuWidth = 200;
    const menuHeight = 160;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    // Adjust horizontal position
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }

    // Adjust vertical position
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    return {
      position: 'fixed' as const,
      left: x,
      top: y,
      zIndex: 1000,
    };
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      style={getMenuStyle()}
      className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px]"
      role="menu"
      aria-label="Zone actions menu"
    >
      {/* Zone info header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${zone.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-sm font-medium text-gray-900">
            {zone.status === 'occupied' ? 'Занятая зона' : 'Свободная зона'}
          </span>
        </div>
        {zone.companyName && (
          <div className="flex items-center gap-1 mt-1">
            <Building2 className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">{zone.companyName}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="py-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-3 py-2 h-auto text-left"
          onClick={() => {
            onToggleStatus(zone);
            onClose();
          }}
        >
          {zone.status === 'occupied' ? (
            <>
              <ToggleLeft className="h-4 w-4 mr-2" />
              Отметить как свободную
            </>
          ) : (
            <>
              <ToggleRight className="h-4 w-4 mr-2" />
              Отметить как занятую
            </>
          )}
        </Button>

        {config.features.vertexEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-3 py-2 h-auto text-left"
            onClick={() => {
              onEdit(zone);
              onClose();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать зону
          </Button>
        )}

        {config.features.zoneDeletion && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-3 py-2 h-auto text-left text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              onDelete(zone);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить зону
          </Button>
        )}
      </div>
    </div>
  );
}