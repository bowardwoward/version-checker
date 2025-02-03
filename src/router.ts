import { Router, Request, Response } from 'express';
import { AppVersionChecker } from './AppVersionChecker';
import { VersionRequest, AppVersionResponse } from './types';

const router = Router();
const versionChecker = new AppVersionChecker();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

router.post('/check-versions', async (req: Request, res: Response) => {
  try {
    const { iosAppId, androidPackageName }: VersionRequest = req.body;

    if (!iosAppId && !androidPackageName) {
      return res.status(400).json({
        error: 'At least one app identifier (iosAppId or androidPackageName) is required'
      });
    }

    const versions: AppVersionResponse = {};

    if (iosAppId) {
      const iosVersion = await versionChecker.getIosVersion(iosAppId);
      if (iosVersion) {
        versions.ios_version = iosVersion;
      }
    }

    if (androidPackageName) {
      const androidVersion = await versionChecker.getAndroidVersion(androidPackageName);
      if (androidVersion) {
        versions.android_version = androidVersion;
      }
    }

    res.json(versions);
  } catch (error) {
    console.error('Error checking versions:', error);
    res.status(500).json({
      error: 'Failed to check app versions'
    });
  }
});

router.get('/version/:platform/:identifier', async (req: Request, res: Response) => {
  try {
    const { platform, identifier } = req.params;

    if (platform !== 'ios' && platform !== 'android') {
      return res.status(400).json({
        error: 'Platform must be either "ios" or "android"'
      });
    }

    let version = null;
    if (platform === 'ios') {
      version = await versionChecker.getIosVersion(identifier);
    } else {
      version = await versionChecker.getAndroidVersion(identifier);
    }

    if (version === null) {
      return res.status(404).json({
        error: 'Version not found'
      });
    }

    res.json(version);
  } catch (error) {
    console.error('Error checking version:', error);
    res.status(500).json({
      error: 'Failed to check app version'
    });
  }
});

export default router;