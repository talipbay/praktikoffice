/**
 * GitHub API integration for storing zone data
 * Simple solution using GitHub repository as backend storage
 */

import { Zone } from '@/types/map/zone';

// GitHub configuration
const GITHUB_OWNER = 'talipbay';
const GITHUB_REPO = 'praktikoffice';
const ZONES_FILE_PATH = 'public/zones-cleaned.json';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API client for zone storage
 */
export class GitHubZoneStorage {
  private token: string | null = null;

  constructor() {
    // Token will be provided by user when they want to make changes
    this.token = null;
  }

  /**
   * Set GitHub token for authenticated requests
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Check if user has provided a token
   */
  hasToken(): boolean {
    return !!this.token;
  }

  /**
   * Load zones from GitHub repository
   */
  async loadZones(): Promise<Zone[]> {
    try {
      const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${ZONES_FILE_PATH}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load zones: ${response.status}`);
      }
      
      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      
      return content.zones || [];
    } catch (error) {
      console.error('Error loading zones from GitHub:', error);
      // Fallback to local zones file
      return this.loadLocalZones();
    }
  }

  /**
   * Fallback to load zones from local file
   */
  private async loadLocalZones(): Promise<Zone[]> {
    try {
      const response = await fetch('/zones-cleaned.json');
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.zones || [];
    } catch {
      return [];
    }
  }

  /**
   * Save zones to GitHub repository (requires token)
   */
  async saveZones(zones: Zone[]): Promise<boolean> {
    if (!this.token) {
      console.warn('No GitHub token provided - changes will be local only');
      return false;
    }

    try {
      // First, get the current file to get its SHA
      const getUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${ZONES_FILE_PATH}`;
      const getResponse = await fetch(getUrl, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!getResponse.ok) {
        throw new Error(`Failed to get current file: ${getResponse.status}`);
      }

      const currentFile = await getResponse.json();
      
      // Prepare the updated content
      const updatedContent = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        zones: zones,
        metadata: {
          totalZones: zones.length,
          freeZones: zones.filter(z => z.status === 'free').length,
          occupiedZones: zones.filter(z => z.status === 'occupied').length,
          exportSource: "Interactive Zone Manager"
        }
      };

      // Update the file
      const updateUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${ZONES_FILE_PATH}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update zones data - ${zones.length} zones (${zones.filter(z => z.status === 'occupied').length} occupied)`,
          content: btoa(JSON.stringify(updatedContent, null, 2)),
          sha: currentFile.sha,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update zones: ${updateResponse.status}`);
      }

      console.log('Zones successfully saved to GitHub');
      return true;
    } catch (error) {
      console.error('Error saving zones to GitHub:', error);
      return false;
    }
  }
}

// Global instance
export const githubStorage = new GitHubZoneStorage();