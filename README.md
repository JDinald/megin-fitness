# Megin Fitness

A React Native fitness tracking app for a 3-day sustainable workout program built with Expo.

## Features

- **3-Day Workout Program**
  - Monday: Power Day (Lower Emphasis)
  - Wednesday: Survival Day (Zone 2 Cardio + Core + Mobility)
  - Friday: Beast Day (Heavy Compounds)

- **Weight Tracking**
  - Log weights per set for each exercise
  - Automatic volume calculation (weight x reps)

- **Workout History**
  - Complete workout logging with all stats
  - View past workouts with full exercise breakdowns
  - Track total volume, sets, and reps over time

- **Personal Records (PRs)**
  - Automatic PR tracking when completing workouts
  - Track max weight per exercise
  - Track best volume per exercise
  - Track best overall workout volume

## Screenshots

The app features a dark theme with color-coded workout days:
- Orange for Monday (Power)
- Green for Wednesday (Survival)
- Purple for Friday (Beast)
- Gold for Personal Records

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

```
src/
├── components/       # Reusable UI components
├── screens/          # Full-screen page components
├── store/            # Zustand state management
├── services/         # External integrations (MMKV storage)
├── utils/            # Workout data definitions
├── types/            # TypeScript type definitions
├── theme/            # Color palette and design tokens
└── navigation/       # Tab navigation setup
```

See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed architecture documentation.

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand with persist middleware
- **Storage:** react-native-mmkv
- **Styling:** React Native StyleSheet + expo-linear-gradient
- **Navigation:** React Navigation (Bottom Tabs)

## Data Persistence

All workout data is persisted locally using MMKV storage:
- Current workout progress (checked exercises, sets, weights)
- Complete workout history
- Personal records

Data persists across app restarts and is stored under the key `workouts-v1`.
