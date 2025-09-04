# Jelačićeva Potkova - React Native Treasure Hunt Game

A mobile treasure hunting game built with React Native and Expo, featuring AR selfies, multilingual support, and historical content about Ban Jelačić.

## Features

- 📍 **GPS-based treasure hunting** - Discover historical locations in real-world locations
- 📱 **AR Selfie Camera** - Take selfies with Jelačić's mustache overlay
- 🌍 **Multilingual Support** - Croatian, Slovenian, and English
- 🏆 **Achievement System** - Unlock rewards for your discoveries
- 📚 **Educational Quizzes** - Learn about Ban Jelačić's history
- 🗺️ **Interactive Map** - Navigate to treasure locations
- 📊 **Progress Tracking** - Track your discoveries and achievements

## Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Navigation library for mobile apps
- **TanStack React Query** - Data fetching and state management
- **Expo Camera** - Camera functionality for AR selfies
- **Expo Location** - GPS and location services
- **React Native SVG** - Vector graphics for mustache overlay
- **AsyncStorage** - Local data storage
- **Zustand** - State management (optional)

## Project Structure

```
src/
├── components/
│   └── UI/              # Reusable UI components
├── screens/             # App screens
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and API client
├── types/               # TypeScript type definitions
└── store/               # State management (if needed)
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Expo CLI (if not already installed):**
   ```bash
   npm install -g expo-cli
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - Install Expo Go app on your mobile device
   - Scan QR code from terminal/browser
   - Or use `npm run ios` / `npm run android` for simulators

## Game Features

### Treasure Hunting
- **5 Historical Locations** - Ban's residence, Jesuit church, old market, royal castle, and Jelačić's horseshoe
- **GPS Detection** - Use real GPS to discover treasures within specified radius
- **Progressive Unlocking** - Treasures must be discovered in order
- **Points System** - Earn points for each discovery

### AR Selfie Camera
- **Mustache Overlay** - Add Jelačić's iconic mustache to your selfies
- **Interactive Positioning** - Touch screen to move mustache
- **Size Controls** - Adjust mustache size
- **Camera Switching** - Front/back camera support
- **Gallery Saving** - Save photos to device gallery

### Educational Content
- **Historical Quizzes** - Learn about Ban Jelačić through interactive quizzes
- **Multilingual Content** - All content available in 3 languages
- **Historical Facts** - Discover interesting facts about each location

### User Experience
- **Modern UI** - Clean, mobile-optimized interface
- **Progress Tracking** - View statistics and completion progress
- **Achievement System** - Unlock achievements for various milestones
- **Language Detection** - Automatic language detection from device settings

## Permissions Required

- **Camera** - For AR selfie functionality
- **Location** - For treasure discovery
- **Media Library** - For saving photos

## Configuration

### Environment Variables
The app uses mock data by default. To connect to a real backend:

1. Update `src/utils/api.ts`
2. Replace `API_BASE_URL` with your server URL
3. Implement authentication if needed

### Treasure Locations
Treasure locations are defined in `src/utils/gameData.ts`. Update coordinates for your specific area.

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### App Store Deployment
1. Follow Expo's deployment guide
2. Update app icons and splash screens in `/assets`
3. Configure app.json for store requirements
4. Test thoroughly on physical devices

## Development Notes

### Mock Data
The app currently uses mock data for development. In production:
- Implement real backend API
- Add user authentication
- Store user progress on server
- Implement real-time achievement checking

### Testing
- Test on both iOS and Android devices
- Verify GPS accuracy in different environments
- Test camera functionality with various lighting conditions
- Ensure permissions work correctly

### Performance
- Images are optimized for mobile
- Efficient GPS polling to save battery
- Lazy loading for better startup time

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the MIT License.

## Credits

- Historical content about Ban Jelačić
- Icons from Material Design Icons
- Built with React Native and Expo