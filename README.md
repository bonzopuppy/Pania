# Pania

A daily companion app that listens to what's happening in your life, asks thoughtful questions, and surfaces wisdom from across spiritual and philosophical traditions — letting you discover which voices resonate with you.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Features

- 🤔 **Daily Reflection** - Share what's on your mind through the clarify flow
- 📚 **Wisdom Discovery** - Receive passages from various spiritual and philosophical traditions
- ✍️ **Personal Reflection** - Write and save your thoughts on the wisdom you receive
- 📓 **Journal** - Access your saved reflections and wisdom
- 🔐 **Authentication** - Sign up with email/password, Google, or Apple
- 👤 **Profile Management** - Manage your account and preferences

## Authentication

The app supports three sign-in methods:
- Email and password
- Google OAuth
- Apple Sign In

### Setting up OAuth

To enable Google and Apple sign-in, follow the guides:
- **[OAuth Setup Guide](./OAUTH-SETUP.md)** - Complete OAuth configuration
- **[TestFlight Quick Start](./TESTFLIGHT-QUICKSTART.md)** - Deploy to TestFlight

**Note:** Email/password authentication works immediately. OAuth requires additional configuration in Google Cloud Console and Apple Developer Portal.

## Architecture

- **Frontend:** React Native with Expo
- **Backend:** Supabase (PostgreSQL + Auth)
- **AI:** Anthropic Claude API
- **Storage:** SecureStore for auth tokens, AsyncStorage for app data

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
