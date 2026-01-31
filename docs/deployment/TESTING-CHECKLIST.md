# Pania Auth Testing Checklist

Use this checklist to verify the auth flow is working correctly.

## Setup Complete ✅

- [x] Supabase project created
- [x] SQL script run in Supabase SQL Editor
- [x] `.env` file updated with URL and publishable key
- [x] Dev server restarted

---

## Test 1: Anonymous First Flow (Free Trial)

**Goal**: Verify users can complete one flow without signing up.

### Steps:
1. Launch app: `npm start` → press `i` or `a`
2. Complete welcome screen (if first launch)
3. Enter name on onboarding screen
4. On home screen, enter a prompt (e.g., "I'm feeling stressed about work")
5. Go through: **Home → Clarify → Wisdom → Reflection**
6. On Reflection screen, click **"Start over"** (don't save)

### Expected Result:
- ✅ Flow completes without any signup prompts
- ✅ You return to home screen
- ✅ No errors in console

**Status**: [ ] Pass / [ ] Fail

---

## Test 2: Signup Gate (After First Flow)

**Goal**: Verify gate blocks access after first anonymous flow.

### Steps:
1. You should already be on the home screen (from Test 1)
2. Check if signup gate appears automatically

### Expected Result:
- ✅ **Signup gate modal appears** immediately
- ✅ Modal shows: "Welcome back" message
- ✅ Modal has Sign Up / Sign In toggle
- ✅ Modal has email and password fields
- ✅ **No "Skip" button** (gate is blocking)
- ✅ Cannot dismiss modal by tapping outside

### Debugging:
If gate doesn't appear:
```bash
# Check storage values
# In React Native Debugger or console:
AsyncStorage.getItem('@pania_flows_completed') // Should be "1"
AsyncStorage.getItem('@pania_user_id')         // Should be null
```

**Status**: [ ] Pass / [ ] Fail

---

## Test 3: Sign Up Flow

**Goal**: Verify user can create an account.

### Steps:
1. In the signup gate modal, ensure "Sign Up" is selected
2. Enter email: `test@example.com`
3. Enter password: `password123` (min 6 characters)
4. Click **"Create Account"**

### Expected Result:
- ✅ Loading indicator appears
- ✅ Modal closes
- ✅ You're back on home screen
- ✅ Can use the app normally

### Verify in Supabase:
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your new user: `test@example.com`
3. Go to **Table Editor** → **profiles**
4. You should see a profile row with your user ID

### Common Errors:
- **"User already exists"**: User with this email already exists, try a different email
- **"Invalid email"**: Check email format
- **"Password too short"**: Password must be at least 6 characters

**Status**: [ ] Pass / [ ] Fail

---

## Test 4: Save to Journal (Authenticated)

**Goal**: Verify authenticated users can save journal entries.

### Steps:
1. Enter a prompt on home screen
2. Go through: **Home → Clarify → Wisdom → Reflection**
3. On Reflection screen, click **"Save to journal"**

### Expected Result:
- ✅ Button shows "Saving..." briefly
- ✅ Alert appears: "Saved! Your reflection has been saved to your journal."
- ✅ No signup modal appears (you're already logged in)

### Verify in Supabase:
1. Go to Supabase Dashboard → **Table Editor** → **journal_entries**
2. You should see your saved entry with:
   - `user_id` matching your user ID
   - `user_input` with your prompt
   - `tradition`, `thinker`, `passage_text`, etc.
   - `created_at` timestamp

**Status**: [ ] Pass / [ ] Fail

---

## Test 5: Anonymous Signup Prompt (Save Flow)

**Goal**: Verify anonymous users see signup modal when trying to save.

### Steps:
1. **Reset app state** using dev menu:
   - Triple-tap greeting on home screen
   - Click "Reset Onboarding"
   - App returns to welcome screen
2. Complete onboarding with a different name
3. Enter a prompt and complete flow: **Home → Clarify → Wisdom → Reflection**
4. On Reflection screen, click **"Save to journal"**

### Expected Result:
- ✅ **Signup modal appears**
- ✅ Modal shows: "Create an account to save your reflections..."
- ✅ Modal has Sign Up / Sign In toggle
- ✅ Modal has **"Skip for now"** button at bottom
- ✅ Text under Skip says "(won't save this reflection)"

**Status**: [ ] Pass / [ ] Fail

---

## Test 6: Skip Save (Anonymous)

**Goal**: Verify "Skip for now" works and increments flow count.

### Steps:
1. In the signup modal (from Test 5), click **"Skip for now"**
2. Modal closes
3. Click **"Start over"**

### Expected Result:
- ✅ Modal closes without saving
- ✅ Returns to home screen
- ✅ **Signup gate appears** (because flowsCompleted = 1 now)

**Status**: [ ] Pass / [ ] Fail

---

## Test 7: Sign In Flow

**Goal**: Verify existing users can sign in.

### Steps:
1. If you have signup gate open, use it. Otherwise, reset app and trigger it.
2. Click **"Sign In"** tab (not Sign Up)
3. Enter the email/password you created in Test 3
4. Click **"Sign In"**

### Expected Result:
- ✅ Loading indicator appears
- ✅ Modal closes
- ✅ Back on home screen
- ✅ Can use app normally
- ✅ Can save to journal

**Status**: [ ] Pass / [ ] Fail

---

## Test 8: Row Level Security

**Goal**: Verify users can only see their own data.

### Steps:
1. While signed in as User A, save a journal entry
2. Reset app and sign up as User B (different email)
3. Check Supabase Table Editor → journal_entries

### Expected Result:
- ✅ User A can see their entries in Supabase
- ✅ User B can see their entries in Supabase
- ✅ Each user has a different `user_id`
- ✅ (Future: When you build journal view, users can't see each other's entries in app)

**Status**: [ ] Pass / [ ] Fail

---

## Common Issues & Solutions

### Issue: "User not authenticated" error
**Solution**:
- Restart dev server: `npm start`
- Check `.env` has correct Supabase URL and key
- Verify you ran the SQL setup script

### Issue: "Failed to save to journal"
**Solution**:
- Check SQL script ran successfully
- Go to Supabase → SQL Editor and re-run `supabase-setup.sql`
- Check Supabase Logs for detailed error

### Issue: Signup gate doesn't appear after first flow
**Solution**:
- Check `flowsCompleted` value in storage
- Make sure you clicked "Start over" (not "Save to journal")
- Verify `incrementFlowsCompleted()` is called in reflection.tsx

### Issue: Can't sign up with same email twice
**Solution**:
- This is expected behavior
- Use a different email or delete the user in Supabase Dashboard → Authentication → Users

### Issue: BlurView not working
**Solution**:
- Restart Expo: Stop server and run `npm start`
- Clear cache: `npm start -- --clear`

---

## Final Verification

Once all tests pass:

- [ ] Anonymous users can try app once
- [ ] Gate blocks after first flow
- [ ] Users can sign up successfully
- [ ] Users can sign in successfully
- [ ] Authenticated users can save entries
- [ ] Entries appear in Supabase
- [ ] Row Level Security is working
- [ ] No console errors

---

## Next Steps After Testing

Once everything works:

1. **Build journal view** to display saved entries
2. **Add password reset** flow
3. **Add Apple/Google OAuth** for easier signup
4. **Add email verification** (optional)
5. **Test on physical device** (not just simulator)

---

**Need help?** Check [AUTH-SETUP.md](AUTH-SETUP.md) for troubleshooting or open an issue.
