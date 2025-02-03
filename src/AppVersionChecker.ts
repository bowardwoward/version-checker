import axios from 'axios';
import * as cheerio from 'cheerio';
import gplay from 'google-play-scraper';
import { AppVersion } from './types';

export class AppVersionChecker {
  private readonly headers: Record<string, string>;
  // 
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
  }

  async getIosVersion(appId: string): Promise<AppVersion | null> {
    try {
      const url = `https://apps.apple.com/us/app/id${appId}`;
      const response = await axios.get(url, { headers: this.headers });
      
      const $ = cheerio.load(response.data);
      const versionElement = $('.whats-new__latest__version');
      if (versionElement.length) {
        return {
          version: versionElement.text().split(' ').pop() || 'Unknown',
          updated: $('.whats-new__latest__date').text() || undefined,
          recentChanges: $('.whats-new__content').text().trim() || undefined
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching iOS version:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async getAndroidVersion(packageName: string): Promise<AppVersion | null> {
    try {
      const appInfo = await gplay.app({ appId: packageName });
      return {
        version: appInfo.version,
        updated: appInfo.updated,
        recentChanges: appInfo.recentChanges
      };
    } catch (error) {
      console.error('Error fetching Android version:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}