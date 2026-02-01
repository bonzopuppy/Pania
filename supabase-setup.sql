-- Pania Database Setup
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- 1. Enable UUID extension (if not already enabled)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. Create journal_entries table
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_input TEXT NOT NULL,
  clarification TEXT,
  tradition TEXT,
  thinker TEXT,
  passage_text TEXT,
  source TEXT,
  context TEXT,
  reflection_question TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own entries
CREATE POLICY "Users can view own journal entries"
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own entries
CREATE POLICY "Users can insert own journal entries"
  ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own entries
CREATE POLICY "Users can update own journal entries"
  ON journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own entries
CREATE POLICY "Users can delete own journal entries"
  ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Create user_tradition_preferences table (optional - for future)
-- ============================================
CREATE TABLE IF NOT EXISTS user_tradition_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tradition TEXT NOT NULL,
  affinity_score FLOAT DEFAULT 0.5,
  PRIMARY KEY (user_id, tradition)
);

-- Enable Row Level Security
ALTER TABLE user_tradition_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own preferences
CREATE POLICY "Users can manage own preferences"
  ON user_tradition_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 5. Create function to handle new user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Create trigger for new user signup
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Setup complete!
-- ============================================
-- Next steps:
-- 1. Update your .env file with SUPABASE_URL and SUPABASE_ANON_KEY
-- 2. Configure email settings in Supabase Dashboard > Authentication > Email Templates
-- 3. Test the signup flow in your app
