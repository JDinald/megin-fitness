# Megin Fitness

A React Native fitness tracking app for a 3-day sustainable workout program.

## Prerequisites

- Node.js 18+
- npm or yarn
- For iOS: macOS with Xcode installed
- For Android: Android Studio with an emulator or physical device

## Installation

```bash
npm install
```

## Running the App

This app uses `react-native-mmkv` which requires native code. It **will not work in Expo Go**. You need to use a development build.

### Option 1: Development Build (Recommended)

```bash
# Create a development build
npx expo prebuild

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Option 2: EAS Build (Cloud)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Create development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

### Option 3: Web (Limited)

MMKV is not supported on web. For web testing, you would need to add a fallback storage adapter.

## Project Structure

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed architecture documentation.

## Tech Stack

- React Native with Expo SDK 54
- TypeScript
- Zustand (state management)
- react-native-mmkv (storage)
