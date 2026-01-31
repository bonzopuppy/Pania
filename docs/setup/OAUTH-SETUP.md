# OAuth Setup Guide for Pania

This guide will help you configure Google and Apple OAuth sign-in for your Pania app.

## Prerequisites

- Active Supabase project (already configured)
- Apple Developer Account ($99/year) - Required for TestFlight and Apple Sign In
- Google Cloud Console account (free)

## Important: Apple App Store Requirement

⚠️ **Apple Policy**: If you include Google sign-in, you MUST also include Apple sign-in, or Apple may reject your app. Both are now implemented in the app.

## Step 1: Configure Google OAuth

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"

### 1.2 Create OAuth 2.0 Client IDs

You need TWO client IDs for Expo apps:

#### Web Client ID (for iOS)
1. Click "Create Credentials" → "OAuth Client ID"
2. Application type: **Web application**
3. Name: "Pania Web Client"
4. Authorized redirect URIs: `https://eabqtjtkydpzqmsqwzoj.supabase.co/auth/v1/callback`
5. Save and note the **Client ID** and **Client Secret**

#### iOS Client ID (optional, for native flow)
1. Click "Create Credentials" → "OAuth Client ID"
2. Application type: **iOS**
3. Name: "Pania iOS"
4. Bundle ID: `com.pania.app`
5. Save and note the **Client ID**

### 1.3 Configure Google in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `eabqtjtkydpzqmsqwzoj`
3. Navigate to Authentication → Providers
4. Find "Google" and click "Edit"
5. Enable the provider
6. Enter your Web Client ID and Client Secret
7. Authorized Client IDs: Add your iOS Client ID if you created one
8. Save changes

## Step 2: Configure Apple Sign In

### 2.1 Apple Developer Portal Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"

### 2.2 Create App ID

1. Click "Identifiers" → "+" button
2. Select "App IDs" → Continue
3. Description: "Pania"
4. Bundle ID: `com.pania.app` (Explicit)
5. Capabilities: Enable "Sign in with Apple"
6. Click Continue → Register

### 2.3 Create Services ID

1. Click "Identifiers" → "+" button
2. Select "Services IDs" → Continue
3. Description: "Pania Sign In"
4. Identifier: `com.pania.app.signin` (must be different from App ID)
5. Enable "Sign in with Apple"
6. Click "Configure" next to Sign in with Apple:
   - Primary App ID: Select your App ID (`com.pania.app`)
   - Domains: `eabqtjtkydpzqmsqwzoj.supabase.co`
   - Return URLs: `https://eabqtjtkydpzqmsqwzoj.supabase.co/auth/v1/callback`
7. Save → Continue → Register

### 2.4 Create Private Key

1. Click "Keys" → "+" button
2. Key Name: "Pania Sign in with Apple Key"
3. Enable "Sign in with Apple"
4. Click "Configure" → Select your Primary App ID → Save
5. Click Continue → Register
6. **Download the .p8 key file** - You can only download this once!
7. Note your **Key ID** (shown after registering)
8. Note your **Team ID** (shown in top right of Apple Developer Portal)

### 2.5 Configure Apple in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Apple" and click "Edit"
3. Enable the provider
4. Enter the following:
   - **Services ID**: `com.pania.app.signin`
   - **Key ID**: From step 2.4.7
   - **Team ID**: From step 2.4.8
   - **Private Key**: Open your .p8 file and paste the entire contents (including BEGIN/END lines)
5. Save changes

## Step 3: Test OAuth Flow

### 3.1 Testing in Development

1. Start your development server:
   ```bash
   npm start
   ```

2. Open the app on a physical iOS device or simulator

3. Navigate to the Profile tab and tap "Sign up / Sign in"

4. Try both "Continue with Apple" and "Continue with Google"

### 3.2 Expected Flow

1. User taps OAuth button
2. Browser opens with provider's sign-in page
3. User authenticates with provider
4. Browser redirects back to app
5. Session is established
6. User is signed in

### 3.3 Troubleshooting

**OAuth doesn't redirect back to app:**
- Check that your redirect URIs exactly match in Supabase, Google, and Apple
- Ensure `scheme: "pania"` is set in app.json
- Try rebuilding the app: `npx expo prebuild --clean`

**Apple Sign In fails:**
- Verify your .p8 key is correctly pasted (all lines including BEGIN/END)
- Check that Services ID is different from Bundle ID
- Ensure domain and return URL are exactly as specified

**Google Sign In fails:**
- Verify you're using the Web Client ID in Supabase, not iOS Client ID
- Check that redirect URI matches exactly (including https://)
- Ensure OAuth consent screen is configured in Google Cloud Console

## Step 4: Prepare for TestFlight

### 4.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 4.2 Login to Expo

```bash
eas login
```

### 4.3 Configure EAS Build

Create `eas.json` in your project root (already done if you ran the setup):

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "buildNumber": "1"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 4.4 Build for TestFlight

```bash
# First build
eas build --platform ios --profile production

# After build completes, submit to TestFlight
eas submit --platform ios
```

### 4.5 TestFlight Configuration

In App Store Connect:
1. Add test information
2. Add beta testers (up to 10,000 external testers)
3. Submit for Beta App Review (required for external testers)

## Step 5: Required Legal Documents

Before submitting to TestFlight with external testers, you need:

### Privacy Policy
You collect:
- Email addresses
- User names
- Journal entries
- OAuth provider data

Create a privacy policy and host it online. Update `app.json`:

```json
"ios": {
  "privacyManifests": {
    "NSPrivacyAccessedAPITypes": [...]
  }
}
```

### Terms of Service (optional but recommended)

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Expo Authentication Guide](https://docs.expo.dev/develop/authentication/)
- [Apple Sign In Guidelines](https://developer.apple.com/sign-in-with-apple/get-started/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## Next Steps

1. Complete OAuth provider setup in Google Cloud Console and Apple Developer Portal
2. Test sign-in flows thoroughly
3. Create privacy policy and host it
4. Build for TestFlight using EAS
5. Add beta testers and submit for review

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs → Auth Logs
2. Check app logs during OAuth flow
3. Verify all IDs and secrets match exactly
4. Ensure your Apple Developer account has valid credentials
