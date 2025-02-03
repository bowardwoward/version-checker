export interface VersionRequest {
    iosAppId?: string;
    androidPackageName?: string;
  }
  
  export interface AppVersion {
    version: string;
    updated?: string;
    recentChanges?: string;
  }
  
  export interface AppVersionResponse {
    ios_version?: AppVersion;
    android_version?: AppVersion;
  }