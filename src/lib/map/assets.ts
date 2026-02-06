/**
 * Utility functions for handling asset paths in different environments
 */

/**
 * Get the correct asset path considering the base path for GitHub Pages
 * @param path - The asset path (e.g., '/floor-plan.png')
 * @returns The full path with base path if needed
 */
export function getAssetPath(path: string): string {
  // No base path needed for regular deployment
  const basePath = '';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * Get the floor plan image URL
 */
export function getFloorPlanUrl(): string {
  const url = getAssetPath('/floor-plan.png');
  console.log('Floor plan URL:', url, 'Environment:', process.env.NODE_ENV);
  return url;
}