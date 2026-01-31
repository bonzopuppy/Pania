# TestFlight Quick Start Guide

This guide will help you get your app onto TestFlight as quickly as possible.

## Overview

You now have Google and Apple sign-in implemented. To submit to TestFlight, you need to:
1. Configure OAuth providers (Google & Apple)
2. Build the app with EAS
3. Submit to TestFlight

## Quick Setup Checklist

### ⚡ Fast Track: Skip OAuth Setup Initially

If you want to get to TestFlight quickly, you can:
1. **Keep OAuth buttons** (they're implemented but won't work until configured)
2. **Users can still use email/password** to sign in
3. **Configure OAuth later** after your beta is live

The app is fully functional with email/password authentication right now.

### 🔐 Full Setup: Configure OAuth First

If you want fully working Google/Apple sign-in for your beta testers:
1. Follow [OAUTH-SETUP.md](./OAUTH-SETUP.md) to configure providers
2. This takes about 1-2 hours for first-time setup
3. Recommended if your testers expect social sign-in

## Steps to TestFlight

### 1. Prerequisites

- [ ] Apple Developer Account ($99/year)
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into Expo: `eas login`

### 2. Update Bundle Identifier (if needed)

In [app.json](./app.json), the bundle identifier is set to:
```json
"ios": {
  "bundleIdentifier": "com.pania.app"
}
```

You may want to change this to match your Apple Developer team:
- `com.yourcompany.pania`
- `com.yourname.pania`

### 3. Configure EAS for Your Account

Edit [eas.json](./eas.json) and update the submit section:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-actual-apple-id@example.com",
      "appleTeamId": "YOUR_TEAM_ID"
    }
  }
}
```

Find your Team ID in [Apple Developer Portal](https://developer.apple.com/account) (top right corner).

### 4. Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" → "+" → "New App"
3. Platforms: iOS
4. Name: Pania (or your preferred name)
5. Primary Language: English
6. Bundle ID: Select the one matching your app.json (`com.pania.app`)
7. SKU: Can be anything unique (e.g., "pania-app-001")
8. User Access: Full Access

### 5. Build for iOS

```bash
# This will create a production build for TestFlight
eas build --platform ios --profile production
```

This will:
- Ask you to create/select Apple credentials
- Generate a build in the cloud (takes ~10-20 minutes)
- Provide a build URL when complete

### 6. Submit to TestFlight

After the build completes:

```bash
eas submit --platform ios --latest
```

Or manually:
1. Download the .ipa from the EAS build page
2. Upload via Xcode → Window → Organizer → Archives
3. Or use Transporter app from Mac App Store

### 7. Configure TestFlight in App Store Connect

1. Go to App Store Connect → Your App → TestFlight
2. Wait for "Processing" to complete (~5-15 minutes)
3. Add "Test Information":
   - Beta App Description: Brief description of your app
   - Feedback Email: Your email
   - What to Test: What you want testers to focus on
4. Add Internal Testers (instant access, up to 100 testers)
5. Add External Testers (requires Beta App Review, up to 10,000 testers)

### 8. Add Beta Testers

#### Internal Testers (Instant)
1. TestFlight → Internal Testing → "+" button
2. Add testers by email
3. They get an invite immediately

#### External Testers (Requires Review)
1. TestFlight → External Testing → "+" button
2. Create a group (e.g., "Beta Testers")
3. Add testers by email
4. Submit for Beta App Review
5. Review takes ~24 hours typically

## Testing the OAuth Flow

### Before OAuth Configuration

- Email/password sign-in will work
- OAuth buttons will show an error
- This is fine for initial testing!

### After OAuth Configuration

Test both flows:
1. Sign up with email/password ✅
2. Sign in with Google ✅
3. Sign in with Apple ✅
4. Sign out and back in ✅

## Common Issues

### Build Fails: Missing Credentials
**Solution**: Run `eas credentials` to configure credentials

### Submit Fails: Missing Privacy Policy
**Solution**: Add privacy policy URL to App Store Connect

### OAuth Buttons Don't Work
**Solution**: This is expected until you configure providers in Supabase (see [OAUTH-SETUP.md](./OAUTH-SETUP.md))

### App Rejected: Missing App Store Compliance
**Solution**:
- Add App Privacy details in App Store Connect
- Add Export Compliance info (usually "No" for non-encrypted apps)

## Subsequent Builds

After your initial submission:

1. Update version or build number in [app.json](./app.json):
   ```json
   "version": "1.0.1",
   "ios": {
     "buildNumber": "2"
   }
   ```

2. Build and submit:
   ```bash
   eas build --platform ios --profile production --auto-submit
   ```

## App Store Listing (After Beta)

When ready for public release:
1. Complete App Store listing in App Store Connect
2. Add screenshots (required)
3. Add app preview video (optional)
4. Submit for App Review
5. Review typically takes 24-48 hours

## Cost Summary

- Apple Developer Account: $99/year (required)
- EAS Build: Free tier includes builds (paid plans for more)
- Supabase: Free tier sufficient for beta
- Anthropic API: Pay per use

## Need Help?

- EAS Builds: https://docs.expo.dev/build/introduction/
- TestFlight: https://developer.apple.com/testflight/
- OAuth Setup: See [OAUTH-SETUP.md](./OAUTH-SETUP.md)

## Next Steps

1. [ ] Complete prerequisites
2. [ ] Update bundle identifier if needed
3. [ ] Run `eas build --platform ios --profile production`
4. [ ] Submit to TestFlight
5. [ ] Add beta testers
6. [ ] Optional: Configure OAuth providers
7. [ ] Share with friends! 🎉
