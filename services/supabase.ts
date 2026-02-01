import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we're in a browser environment (not SSR)
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Custom storage adapter - uses SecureStore on native, localStorage on web (browser only)
const SecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return null;
      return window.localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return;
      window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (!isBrowser) return;
      window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Initialize session on startup
supabase.auth.getSession().then(({ data: { session }, error }) => {
  console.log('=== Supabase Session Initialization ===');
  if (error) {
    console.error('Session initialization error:', error);
  }
  console.log('Session exists:', session ? 'YES' : 'NO');
  if (session) {
    console.log('Session user ID:', session.user.id);
    console.log('Session expires at:', new Date(session.expires_at! * 1000).toISOString());
  }
  console.log('=======================================');
}).catch((error) => {
  console.error('Failed to initialize session:', error);
});

// Types for our database
export type JournalEntry = {
  id: string;
  user_id: string;
  user_input: string;
  clarification: string | null;
  tradition: string | null;
  thinker: string | null;
  passage_text: string | null;
  source: string | null;
  context: string | null;
  reflection_question: string | null;
  notes: string | null;
  conversation_data: Record<string, unknown> | null;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
};
