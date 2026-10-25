import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timeflow.app',
  appName: 'TimeFlow',
  webDir: 'dist',
  backgroundColor: '#0d0d0f',
  android: {
    allowMixedContent: false,
  },
};

export default config;
