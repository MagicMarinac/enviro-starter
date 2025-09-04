# Xcode Import Instructions

## Prerequisites

1. **Mac computer** with macOS 10.15+ (Catalina or later)
2. **Xcode 12+** installed from Mac App Store
3. **Node.js 16+** and npm installed
4. **Expo CLI** installed: `npm install -g @expo/cli`
5. **EAS CLI** installed: `npm install -g eas-cli`

## Method 1: Generate iOS Project with Expo Prebuild (Recommended)

### Step 1: Install Dependencies
```bash
cd react-native-treasure-hunt
npm install
```

### Step 2: Generate Native iOS Code
```bash
# This creates the ios/ folder with Xcode project files
npx expo prebuild --platform ios
```

### Step 3: Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### Step 4: Open in Xcode
```bash
# Open the workspace (not the .xcodeproj file)
open ios/jelacicshorseshoe.xcworkspace
```

## Method 2: EAS Development Build (Alternative)

### Step 1: Configure EAS
```bash
# Login to Expo account
eas login

# Configure the project
eas build:configure
```

### Step 2: Create Development Build
```bash
# Build for iOS simulator
eas build --platform ios --profile development

# Or build for device
eas build --platform ios --profile development --local
```

## Xcode Configuration

### Required Settings in Xcode:

1. **Team & Bundle ID**
   - Select your project in navigator
   - Under "Signing & Capabilities" tab
   - Choose your development team
   - Bundle identifier: `com.jelacic.horseshoe`

2. **Deployment Target**
   - Set to iOS 13.0 or later
   - Already configured in app.json

3. **Permissions**
   - Camera access (NSCameraUsageDescription)
   - Location access (NSLocationWhenInUseUsageDescription)
   - Photo library access (NSPhotoLibraryUsageDescription)
   - All configured in Info.plist automatically

### Building and Running:

1. **Simulator**
   - Select iOS Simulator as target
   - Press ⌘+R to build and run

2. **Physical Device**
   - Connect iPhone via USB
   - Select device as target
   - Enable "Developer Mode" on iPhone (Settings > Privacy & Security)
   - Press ⌘+R to build and run

## Project Structure After Prebuild

```
react-native-treasure-hunt/
├── ios/                          # Generated iOS project
│   ├── jelacicshorseshoe.xcworkspace    # Open this in Xcode
│   ├── jelacicshorseshoe.xcodeproj      # Don't open this directly
│   ├── Podfile                   # iOS dependencies
│   └── jelacicshorseshoe/        # iOS app files
│       ├── Info.plist           # App permissions & metadata
│       └── ...
├── src/                         # Your React Native code
├── App.tsx                      # Main entry point
├── app.json                     # Expo configuration
└── package.json                 # Dependencies
```

## Features Available in iOS Build

✅ **Fully Working:**
- Camera with AR mustache overlay
- GPS location services
- Photo saving to device gallery
- All navigation and UI
- Multilingual support
- Push notifications (if configured)

⚠️ **Requires Signing:**
- App Store deployment
- TestFlight distribution
- Device installation (needs developer account)

## Troubleshooting

### Common Issues:

1. **"No provisioning profile found"**
   - Add Apple Developer account in Xcode preferences
   - Select correct team in project settings

2. **Pod install fails**
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```

3. **Build errors**
   - Clean build: Product → Clean Build Folder in Xcode
   - Reset Metro: `npx expo start --clear`

4. **Permission denied for camera/location**
   - Check Info.plist has usage descriptions
   - Reset simulator: Device → Erase All Content and Settings

### Performance Tips:

- Use iOS Simulator for development
- Test camera features on real device
- Use Debug configuration for development
- Switch to Release for performance testing

## Next Steps

1. Test all features in iOS Simulator
2. Test camera/GPS on physical device
3. Configure app signing for device testing
4. Prepare for App Store submission (if needed)

Your treasure hunt game is now ready for iOS development in Xcode!