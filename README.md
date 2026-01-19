# Megin Fitness

A React Native fitness tracking app for a 3-day sustainable workout program.

## Prerequisites

- Node.js 18+
- npm or yarn
- For iOS: macOS with Xcode installed
- For Android: Android Studio with an emulator or physical device

## Installation

```bash
# Install dependencies
npm install

# Install Expo-compatible native packages
npx expo install expo-system-ui expo-linear-gradient expo-status-bar react-native-safe-area-context react-native-screens react-native-mmkv
```

## Running the App

This app uses `react-native-mmkv` which requires native code. It **will not work in Expo Go**. You need to use a development build.

### Development Build (Recommended)

```bash
# Generate native projects
npx expo prebuild

# Run on Android emulator
npx expo run:android

# Run on iOS simulator (macOS only)
npx expo run:ios
```

### EAS Build (Cloud)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Create development build
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

## Project Structure

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed architecture documentation.

## Tech Stack

- React Native with Expo SDK 54
- TypeScript
- Zustand (state management)
- react-native-mmkv (storage)
