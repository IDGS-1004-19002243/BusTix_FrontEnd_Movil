import { ConfigContext, ExpoConfig } from '@expo/config';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.alexisduran01.bustix.dev';
  }

  if (IS_PREVIEW) {
    return 'com.alexisduran01.bustix.preview';
  }

  return 'com.alexisduran01.bustix';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'BusTix (Dev)';
  }

  if (IS_PREVIEW) {
    return 'BusTix';
  }

  return 'BusTix-1';
};


  export default ({ config }:ConfigContext ):ExpoConfig => ({
    ...config,
    "name": getAppName(),
    "slug": "bustix",
    "version": "1.0.0",
    "orientation": "default",
    "icon": "./assets//icons/splash-icon-dark.png",
    "scheme": "BusTix",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/icons/splash-icon-dark.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff",
      "dark": {
        "image": "./assets/icons/splash-icon-light.png",
        "backgroundColor": "#0F0F0F"
      }
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "config": {
        "usesNonExemptEncryption": false
      },
      "icon": {
        "dark": "./assets/icons/ios-dark.png",
        "light": "./assets/icons/ios-light.png",
        "tinted": "./assets/icons/ios-tinted.png"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/adaptive-icon.png",
        "monochromeImage": "./assets/icons/adaptive-icon.png",
        "backgroundColor": "#0F0F0F"
      },
      "edgeToEdgeEnabled": true,
      "package": getUniqueIdentifier()
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/icons/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-web-browser",
      "expo-font",
      "expo-secure-store",
      "expo-barcode-scanner"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "5a12ed16-9520-4b3a-9a8c-e32078ced47f"
      }
    },
    "owner": "alexisduran01"
  });