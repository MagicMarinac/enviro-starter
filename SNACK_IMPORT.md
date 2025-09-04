# Expo Snack Import Instructions

## How to Import into Expo Snack

### Option 1: Direct File Upload
1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create a new Snack
3. Delete the default App.js file
4. Upload all project files maintaining the folder structure:
   ```
   App.tsx (main entry point)
   app.json (configuration)
   package.json (dependencies)
   src/
   ├── components/UI/
   ├── screens/
   ├── hooks/
   ├── types/
   └── utils/
   ```

### Option 2: GitHub Import
1. Upload this project to your GitHub repository
2. Go to [snack.expo.dev](https://snack.expo.dev)
3. Click "Import from GitHub"
4. Enter your repository URL

### Option 3: Copy and Paste Files
1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create each file manually by copying content from this project
3. Start with App.tsx, package.json, and app.json
4. Then create the folder structure and add each screen

## Important Notes

### Dependencies
The project uses these Expo-compatible libraries:
- `expo-camera` for AR selfie functionality
- `expo-location` for GPS treasure hunting
- `@react-navigation/native` for navigation
- `@expo/vector-icons` for icons
- `@react-native-async-storage/async-storage` for storage

### Permissions
The app requires:
- Camera permission (for AR selfies)
- Location permission (for treasure hunting)

### Testing
1. Use Expo Go app on your phone to test
2. Camera features require a physical device
3. Location features work best outdoors

## Features Available in Snack

✅ **Working Features:**
- Navigation between screens
- Multilingual support (HR/SL/EN)
- Mock data and game logic
- UI components and styling
- Achievement system
- Progress tracking

⚠️ **Limited in Web Preview:**
- Camera functionality (use mobile device)
- GPS location services (use mobile device)
- Some native features

📱 **Best Experience:**
- Install Expo Go on your mobile device
- Scan QR code from Snack
- Test all features on actual device

## Troubleshooting

**Common Issues:**
1. **Import errors** - Make sure all file paths use relative imports (no @/ aliases)
2. **Missing dependencies** - Snack will auto-install most dependencies
3. **TypeScript errors** - May appear but usually don't prevent app from running
4. **Camera not working** - Only works on physical mobile devices, not in web preview

**Solutions:**
- Use mobile device for full functionality testing
- Check console for any import path errors
- Ensure all files are uploaded with correct folder structure

## File Structure
```
react-native-treasure-hunt/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── src/
│   ├── components/UI/     # Reusable UI components
│   ├── screens/           # App screens (5 main screens)
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # API client and game data
└── README.md             # Full documentation
```

This is a complete React Native treasure hunting game ready for Expo Snack!