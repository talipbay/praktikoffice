/**
 * Application configuration from environment variables
 */

/**
 * Check if vertex editing is enabled
 * Controlled by NEXT_PUBLIC_ENABLE_VERTEX_EDITING environment variable
 */
export const isVertexEditingEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_VERTEX_EDITING === 'true';
};

/**
 * Check if zone deletion is enabled
 * Controlled by NEXT_PUBLIC_ENABLE_ZONE_DELETION environment variable
 */
export const isZoneDeletionEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_ZONE_DELETION === 'true';
};

/**
 * Check if zone creation is enabled
 * Controlled by NEXT_PUBLIC_ENABLE_ZONE_CREATION environment variable
 */
export const isZoneCreationEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_ZONE_CREATION === 'true';
};

/**
 * Configuration object for easy access
 */
export const config = {
  features: {
    vertexEditing: isVertexEditingEnabled(),
    zoneDeletion: isZoneDeletionEnabled(),
    zoneCreation: isZoneCreationEnabled(),
  }
} as const;