# Pania Authentication Setup Guide

This guide walks you through setting up the "try once, then signup" authentication flow for Pania.

## Overview

The auth flow works like this:

1. **First Use (Anonymous)**: User can complete one full flow without signing up
2. **After First Flow**: User is prompted to sign up when trying to save their reflection
3. **Second Use**: If they skipped signup, they're blocked with a signup gate on the home screen
4. **Signed Up Users**: Can save journal entries and use the app unlimited times

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `pania` (or whatever you prefer)
   - **Database Password**: Generate a secure password (save it somewhere safe)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes for provisioning

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Publishable key** (also called "anon key" - the longer one under "Project API keys")

   ⚠️ **Important**: Use the **publishable/anon key**, NOT the secret/service_role key!

## Step 3: Update Your .env File

Open `.env` in the root of your project and replace the placeholder values:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Restart your Expo dev server after updating the .env file:
```bash
# Stop the current server (Ctrl+C), then:
npm start
```

## Step 4: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (in the sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql` from this repo
4. Paste it into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)

This will create:
- `profiles` table (stores user name and email)
- `journal_entries` table (stores reflections)
- `user_tradition_preferences` table (for future features)
- Row Level Security policies (ensures users only see their own data)
- Automatic profile creation trigger

## Step 5: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Customize email templates in **Authentication** > **Email Templates**

### Optional: Add OAuth Providers

To add Apple/Google sign-in:

1. Go to **Authentication** > **Providers**
2. Enable **Apple** and/or **Google**
3. Follow the setup instructions for each provider
4. Update `SignupModal.tsx` to add OAuth buttons (coming soon)

## Step 6: Test the Flow

### Test Anonymous Flow (First Use)

1. Launch the app: `npm start`
2. Press `i` for iOS or `a` for Android
3. Complete the welcome/onboarding flow
4. Enter a prompt on the home screen
5. Go through: Clarify → Wisdom → Reflection
6. Click "Start over" (don't save)
7. You should see the **signup gate** on the home screen

### Test Signup Prompt (Save Flow)

1. Start fresh (or use dev menu to reset onboarding)
2. Complete a flow: Home → Clarify → Wisdom → Reflection
3. Click "Save to journal"
4. You should see the **signup modal**
5. Enter email and password (min 6 characters)
6. Click "Create Account"
7. Check Supabase **Authentication** > **Users** to see your new user

### Test Journal Saving

1. After signing up, try to save a reflection
2. It should save successfully
3. Check Supabase **Table Editor** > **journal_entries** to see your data

## Troubleshooting

### "User not authenticated" error

- Check that your Supabase URL and anon key are correct in `.env`
- Make sure you restarted the Expo server after updating `.env`
- Check Supabase **Authentication** > **Users** to verify the user was created

### "Failed to save to journal" error

- Check Supabase **Table Editor** to verify the tables were created
- Go to **SQL Editor** and run the setup script again
- Check the **Logs** in Supabase to see detailed error messages

### Email not sending

- Check **Authentication** > **Settings** > **Email Templates**
- For development, Supabase shows a confirmation link in the logs
- In production, you'll need to configure SMTP or use Supabase's built-in email

### "Network request failed" error

- Check that you're connected to the internet
- Try pinging your Supabase URL: `curl https://xxxxx.supabase.co`
- Check if Supabase is having issues: [status.supabase.com](https://status.supabase.com)

## Development Tools

### Dev Menu (Triple-tap the greeting)

1. On the home screen, triple-tap "Good morning/afternoon/evening"
2. Click "Reset Onboarding" to test the welcome flow again
3. This clears your name and flows completed count

### Manual Data Reset

To completely reset your test data:

1. Go to Supabase **SQL Editor**
2. Run:
```sql
-- Delete your test journal entries
DELETE FROM journal_entries WHERE user_id = 'your-user-id';

-- Or delete everything (careful!)
TRUNCATE journal_entries CASCADE;
```

## What's Next?

Once auth is working, you can:

1. **Add OAuth providers** (Apple, Google) for easier signup
2. **Build a journal view** to display saved entries
3. **Add tradition preferences** to personalize wisdom recommendations
4. **Implement password reset** flow (already set up in backend)
5. **Add profile editing** (name, email changes)

## Files Created/Modified

### New Files
- `services/supabase.ts` - Supabase client configuration
- `services/auth.ts` - Authentication functions
- `services/journal.ts` - Journal CRUD operations
- `components/SignupModal.tsx` - Signup/signin modal
- `components/SignupGate.tsx` - Blocking gate after first flow
- `supabase-setup.sql` - Database schema

### Modified Files
- `services/storage.ts` - Added flow tracking and user ID storage
- `app/(tabs)/index.tsx` - Added signup gate logic
- `app/reflection.tsx` - Added save to journal and signup prompt
- `.env` - Added Supabase credentials
- `package.json` - Added Supabase dependencies

## Security Notes

- ✅ Row Level Security (RLS) is enabled - users can only access their own data
- ✅ Auth tokens are stored in secure storage (expo-secure-store)
- ✅ API keys in `.env` are safe for client-side use (anon key is public)
- ⚠️  Never commit `.env` to git (it's already in `.gitignore`)
- ⚠️  For production, consider adding rate limiting on Supabase

---

Need help? Check the [Supabase docs](https://supabase.com/docs) or open an issue!
