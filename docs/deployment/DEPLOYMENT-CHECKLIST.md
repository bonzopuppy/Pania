# TestFlight Deployment Checklist

## Pre-Deployment Checklist

### Essential Setup
- [x] Email/password authentication working
- [x] OAuth buttons added (Google & Apple)
- [x] Sign-out redirects to welcome screen
- [x] App.json configured with bundle identifier
- [x] EAS build configuration created
- [ ] Apple Developer Account active ($99/year)
- [ ] .env file contains valid Supabase credentials

### Optional OAuth Setup (Can be done later)
- [ ] Google Cloud Console project created
- [ ] Google OAuth Client IDs created
- [ ] Google provider configured in Supabase
- [ ] Apple Services ID created
- [ ] Apple Sign In key (.p8) generated
- [ ] Apple provider configured in Supabase

## Build Configuration

### Update Bundle Identifier (Optional)
Current: `com.pania.app`

If you want to use your own domain:
1. Edit `app.json` → `ios.bundleIdentifier`
2. Update to `com.yourcompany.pania` or similar
3. Remember to use the same ID in Apple Developer Portal

### EAS Configuration
- [x] eas.json created
- [ ] Update `appleId` in eas.json with your Apple ID email
- [ ] Update `appleTeamId` with your Apple Team ID

## Apple Developer Portal Setup

### App ID Configuration
- [ ] Created App ID with bundle identifier
- [ ] Enabled "Sign in with Apple" capability
- [ ] App ID matches app.json bundle identifier

### If Using Apple OAuth
- [ ] Created Services ID for Sign in with Apple
- [ ] Configured Services ID with Supabase domain
- [ ] Generated private key (.p8)
- [ ] Saved Key ID and Team ID

## App Store Connect

### App Creation
- [ ] Created new app in App Store Connect
- [ ] Bundle ID matches your configuration
- [ ] App name set to "Pania" (or your preference)
- [ ] SKU created (unique identifier)

### App Information
- [ ] App description written
- [ ] App category selected
- [ ] Age rating completed
- [ ] Privacy policy URL added (if applicable)

### TestFlight Setup
- [ ] Test Information added
- [ ] Feedback email set
- [ ] Beta App Description written
- [ ] What to Test notes added

## Build & Submit

### Install Tools
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login
```

### First Build
```bash
# Start the build process
eas build --platform ios --profile production
```

During build, you'll be asked:
- [ ] Select Apple Team (or create credentials)
- [ ] Generate Distribution Certificate (yes)
- [ ] Generate Provisioning Profile (yes)

### Submit to TestFlight
```bash
# After build completes
eas submit --platform ios --latest
```

Or manually:
- [ ] Download .ipa from EAS dashboard
- [ ] Upload via Transporter app or Xcode

## TestFlight Configuration

### Processing
- [ ] Wait for "Processing" to complete in App Store Connect (~5-15 min)
- [ ] Check for any processing errors

### Internal Testing (Instant)
- [ ] Add internal testers (up to 100)
- [ ] Testers added by email
- [ ] Test invite sent
- [ ] Confirm testers can install

### External Testing (Optional)
- [ ] Create external test group
- [ ] Add external testers (up to 10,000)
- [ ] Submit for Beta App Review
- [ ] Wait for approval (~24 hours)
- [ ] Testers can install after approval

## Testing Plan

### Core Flows to Test
- [ ] Welcome screen → Name onboarding
- [ ] Clarify flow (share what's on your mind)
- [ ] Wisdom screen (receive passage)
- [ ] Reflection screen (write thoughts)
- [ ] Save to journal (requires sign-up if guest)
- [ ] Profile screen (view/edit profile)
- [ ] Sign out → Returns to welcome

### Authentication Testing
- [ ] Guest mode (no sign-up initially)
- [ ] Email sign-up (new account)
- [ ] Email sign-in (returning user)
- [ ] Sign-out flow
- [ ] Session persistence (close/reopen app)

### If OAuth Configured
- [ ] Google sign-in
- [ ] Apple sign-in
- [ ] Profile creation with OAuth
- [ ] Sign-out after OAuth

## Post-Deployment

### Monitor
- [ ] Check TestFlight feedback
- [ ] Review crash reports in App Store Connect
- [ ] Monitor Supabase auth logs
- [ ] Check Anthropic API usage

### Gather Feedback
- [ ] Ask testers about onboarding
- [ ] Check if wisdom resonates
- [ ] Test reflection flow usability
- [ ] Verify journal navigation

### Iterate
- [ ] Fix reported bugs
- [ ] Increment build number in app.json
- [ ] Build and submit update
- [ ] Notify testers of update

## Future Enhancements

### Before Public Launch
- [ ] Add privacy policy (required for App Store)
- [ ] Add terms of service
- [ ] Create app screenshots (required)
- [ ] Record app preview video (optional)
- [ ] Complete App Store listing
- [ ] Add promotional text
- [ ] Prepare App Store description

### Optional Features
- [ ] Push notifications for reminders
- [ ] Share wisdom passages
- [ ] Export journal entries
- [ ] Search journal
- [ ] Filter by tradition/thinker
- [ ] Dark mode preferences
- [ ] Font size preferences

## Troubleshooting

### Build Fails
**Missing credentials:**
```bash
eas credentials
```

**Code signing issues:**
- Verify bundle ID matches everywhere
- Check Apple Developer account status
- Try `eas build --clear-cache`

### Submit Fails
**Missing compliance:**
- Add export compliance info
- Add privacy policy URL
- Complete App Information

### OAuth Not Working
**Before configuration:**
- This is expected! Email/password still works
- See [OAUTH-SETUP.md](OAUTH-SETUP.md)

**After configuration:**
- Check Supabase auth logs
- Verify redirect URLs match exactly
- Test with console.log in auth.ts

### TestFlight Install Fails
**User can't install:**
- Verify email is correct in TestFlight
- Check device is iOS 13+ (or your minimum)
- Have user update iOS if needed
- Resend invite

## Success Criteria

### MVP Launch (TestFlight)
- [ ] 5-10 friends can install
- [ ] All can complete core flow
- [ ] No critical bugs
- [ ] Auth works reliably
- [ ] Journal saves correctly

### Beta Success
- [ ] 50+ testers
- [ ] Positive feedback on concept
- [ ] Low crash rate (<1%)
- [ ] High completion rate for flows
- [ ] Clear direction for improvements

### Ready for App Store
- [ ] Beta tested with 100+ users
- [ ] All critical bugs fixed
- [ ] App Store listing complete
- [ ] Marketing materials ready
- [ ] Privacy policy published
- [ ] Support infrastructure ready

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [OAuth Setup Guide](./OAUTH-SETUP.md)
- [TestFlight Quick Start](./TESTFLIGHT-QUICKSTART.md)

## Quick Commands Reference

```bash
# Start development
npm start

# Type check
npx tsc --noEmit

# Build for TestFlight
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest

# Build and auto-submit
eas build --platform ios --profile production --auto-submit

# View builds
eas build:list

# View credentials
eas credentials

# Check build status
eas build:view [BUILD_ID]
```

---

**Current Status:** Ready for TestFlight submission!

**Next Step:** Follow [TESTFLIGHT-QUICKSTART.md](./TESTFLIGHT-QUICKSTART.md)
