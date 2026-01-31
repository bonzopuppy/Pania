# 🚀 Quick Start: Pania Auth Setup

## 5-Minute Setup

### 1. Create Supabase Project (2 min)
```
1. Go to: https://supabase.com
2. Click "New Project"
3. Name: "pania"
4. Wait for provisioning (~2 min)
```

### 2. Get Credentials (30 sec)
```
1. Go to: Project Settings → API
2. Copy "Project URL"
3. Copy "Publishable key" (also called "anon key")
   ⚠️  Use publishable key, NOT secret key!
```

### 3. Update .env (30 sec)
```bash
# Open .env and replace these:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Database Setup (1 min)
```
1. Go to: Supabase Dashboard → SQL Editor
2. Copy all of supabase-setup.sql
3. Paste and click "Run"
```

### 5. Restart Dev Server (30 sec)
```bash
# Stop current server (Ctrl+C)
npm start
# Press 'i' for iOS or 'a' for Android
```

## ✅ Test It Works

1. **Complete one flow** without signing up
2. Click **"Start over"**
3. **You should see the signup gate** 🎉
4. **Sign up** with email/password
5. **Try to save** - it should work!

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "User not authenticated" | Restart dev server after updating .env |
| "Failed to save" | Check SQL script ran successfully |
| Signup gate not showing | Check flowsCompleted in storage |
| Can't sign up | Check Supabase is reachable |

## 📚 Full Guides

- **[AUTH-SETUP.md](AUTH-SETUP.md)** - Detailed setup guide
- **[IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)** - Architecture overview
- **[supabase-setup.sql](supabase-setup.sql)** - Database schema

## 🎯 What You Get

- ✅ Try once without signup (low friction)
- ✅ Signup gate after first use (protects API costs)
- ✅ Save reflections to cloud (persistent)
- ✅ Secure auth with Supabase (RLS enabled)
- ✅ Ready for Apple/Google OAuth (add later)

---

**That's it!** You're ready to test the auth flow. 🚀
