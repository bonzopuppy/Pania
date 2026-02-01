/**
 * Debug utilities for testing Supabase connection
 * Use these functions to troubleshoot auth and database issues
 */

import { supabase } from './supabase';
import { getUserId } from './storage';

/**
 * Test Supabase connection
 */
export async function testConnection() {
  console.log('=== Testing Supabase Connection ===');

  try {
    // Test 1: Check if Supabase client is configured
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    console.log('1. Config check:');
    console.log('   URL:', url ? '✅ Set' : '❌ Missing');
    console.log('   Key:', key ? '✅ Set' : '❌ Missing');

    // Test 2: Check auth status
    console.log('\n2. Auth check:');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.log('   ❌ Auth error:', authError.message);
    } else if (user) {
      console.log('   ✅ User authenticated');
      console.log('   User ID:', user.id);
      console.log('   Email:', user.email);
    } else {
      console.log('   ⚠️  No user authenticated');
    }

    // Test 3: Check local storage
    console.log('\n3. Local storage check:');
    const localUserId = await getUserId();
    console.log('   Stored user ID:', localUserId || 'null');

    // Test 4: Try to query journal_entries table
    console.log('\n4. Database check:');
    const { data, error: dbError } = await supabase
      .from('journal_entries')
      .select('id')
      .limit(1);

    if (dbError) {
      console.log('   ❌ Database error:', dbError.message);
      console.log('   Error details:', dbError);
    } else {
      console.log('   ✅ Can query journal_entries table');
      console.log('   Entries count:', data?.length || 0);
    }

    console.log('\n=== Test Complete ===\n');

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
}

/**
 * Test saving a journal entry
 */
export async function testSaveEntry() {
  console.log('=== Testing Journal Entry Save ===');

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ No user authenticated - cannot test save');
      return;
    }

    console.log('✅ User authenticated:', user.id);

    const testEntry = {
      user_id: user.id,
      user_input: 'Test entry from debug',
      clarification: 'Test clarification',
      tradition: 'stoicism',
      thinker: 'Marcus Aurelius',
      passage_text: 'Test passage',
      source: 'Test source',
      context: 'Test context',
      reflection_question: 'Test question?',
      notes: null,
    };

    console.log('Attempting to insert:', testEntry);

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(testEntry)
      .select()
      .single();

    if (error) {
      console.log('❌ Insert failed:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Insert successful!');
      console.log('Saved entry:', data);
    }

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
}

/**
 * Check RLS policies
 */
export async function testRLS() {
  console.log('=== Testing Row Level Security ===');

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ No user authenticated - cannot test RLS');
      return;
    }

    console.log('✅ Testing as user:', user.id);

    // Try to select from journal_entries
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.log('❌ RLS blocking select:', error.message);
    } else {
      console.log('✅ Can select own entries:', data?.length || 0);
    }

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
}

/**
 * Complete reset - clears ALL auth and local state
 * Use this to test the complete flow from scratch
 */
export async function resetEverything() {
  console.log('=== Resetting Everything ===');

  try {
    // 1. Sign out from Supabase (clears SecureStore session)
    console.log('1. Signing out from Supabase...');
    await supabase.auth.signOut();

    // 2. Clear all local storage
    console.log('2. Clearing AsyncStorage...');
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.clear();

    // 3. Clear SecureStore manually (just to be thorough)
    console.log('3. Clearing SecureStore...');
    const SecureStore = await import('expo-secure-store');
    const keys = [
      'supabase.auth.token',
      'sb-eabqtjtkydpzqmsqwzoj-auth-token',
    ];
    for (const key of keys) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        // Key might not exist, that's ok
      }
    }

    console.log('✅ Reset complete! Restart the app to test fresh.');
    console.log('===============================');

  } catch (error) {
    console.error('❌ Reset failed:', error);
  }
}
