export interface VersionRequest {
    iosAppId?: string;
    androidPackageName?: string;
  }
  
  export interface AppVersion {
    version: string;
    updated?: string | number;
    recentChanges?: string;
  }
  
  export interface AppVersionResponse {
    ios_version?: AppVersion;
    android_version?: AppVersion;
  }