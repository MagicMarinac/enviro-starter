# Build Instructions - Jelačićeva Potkova

## Native Folder Structure
✅ **android/** - Complete Android project with gradle configuration
✅ **ios/** - Complete iOS project with Xcode configuration

## Android Build
```bash
cd android
./gradlew assembleDebug          # Debug APK
./gradlew assembleRelease        # Release APK
./gradlew bundleRelease          # Release AAB for Play Store
```

## iOS Build
```bash
cd ios
xcodebuild -workspace JelacicevaPotkova.xcworkspace -scheme JelacicevaPotkova -configuration Debug
```

## EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli
eas login

# Android builds
eas build --platform android --profile preview    # APK for testing
eas build --platform android --profile production # AAB for Play Store

# iOS builds  
eas build --platform ios --profile preview        # Development build
eas build --platform ios --profile production     # App Store build
```

## Key Features
- **Package**: com.jelacic.horseshoe
- **App Name**: Jelačićeva Potkova
- **All Permissions**: Camera, Location, Storage
- **Testing Mode**: All treasures clickable
- **Statistics**: Refresh properly after collection
- **AR Camera**: Full functionality with fallback