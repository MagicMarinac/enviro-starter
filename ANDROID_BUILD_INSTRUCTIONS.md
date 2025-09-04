# Android Build Instructions for Jelačićeva Potkova

## Prerequisites
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Create Expo account at expo.dev
3. Login: `eas login`

## Build Commands

### Development Build (APK)
```bash
eas build --platform android --profile development
```

### Preview Build (APK for Testing)
```bash
eas build --platform android --profile preview
```

### Production Build (AAB for Google Play)
```bash
eas build --platform android --profile production
```

## Android Permissions Included
- **CAMERA** - AR selfie functionality
- **ACCESS_FINE_LOCATION** - GPS treasure hunting
- **ACCESS_COARSE_LOCATION** - Location backup
- **WRITE_EXTERNAL_STORAGE** - Save photos
- **READ_EXTERNAL_STORAGE** - Access photos

## App Package Details
- **Package Name**: com.jelacic.horseshoe
- **App Name**: Jelačićeva Potkova
- **Version**: 1.0.0 (Version Code: 1)

## Installation
After build completes, download the APK and install on Android device or use ADB:
```bash
adb install app-release.apk
```

## Testing Mode Features
- All treasures are immediately clickable
- No distance restrictions for easy testing
- Statistics refresh properly after collecting treasures
- Camera permissions with fallback handling