import { supabase } from './supabase';
import { setUserId, clearUserId, getUserName, getUserId, setUserName, setOnboarded, clearOnboarding } from './storage';
import { deleteEncryptionKey } from './encryption';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Initialize WebBrowser for OAuth flows
WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email?: string;
};

export type OAuthProvider = 'google' | 'apple';

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      return { user: null, error };
    }

    console.log('Signup response:', { user: data.user, session: data.session });

    if (data.user && data.session) {
      // Store user ID locally
      await setUserId(data.user.id);

      console.log('Session established:', data.session.access_token ? 'Yes' : 'No');

      // Create profile with stored name if available
      const name = await getUserName();
      if (name) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
        });
        if (profileError && profileError.code !== '23505') {
          // Ignore duplicate key errors (user already has a profile)
          console.error('Profile creation error:', profileError);
        }
      }

      return { user: { id: data.user.id, email: data.user.email }, error: null };
    }

    return { user: null, error: new Error('Sign up failed - no session') };
  } catch (error) {
    console.error('Signup exception:', error);
    return { user: null, error: error as Error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    if (data.user) {
      await setUserId(data.user.id);

      // Fetch and sync user's name from profile
      const { name } = await fetchUserProfile(data.user.id);
      if (name) {
        await setUserName(name);
        await setOnboarded();
      }

      return { user: { id: data.user.id, email: data.user.email }, error: null };
    }

    return { user: null, error: new Error('Sign in failed') };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    // Clear auth session but keep name/onboarding status for returning users
    await clearUserId();

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Sync user ID to local storage
      await setUserId(user.id);
      return { id: user.id, email: user.email };
    }

    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Debug session state - helps diagnose auth issues
 */
export async function debugSessionState(): Promise<void> {
  console.log('=== Auth Debug Info ===');

  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Session error:', sessionError);
  console.log('Session exists:', session ? 'YES' : 'NO');
  if (session) {
    console.log('  User ID:', session.user.id);
    console.log('  Email:', session.user.email);
    console.log('  Expires:', new Date(session.expires_at! * 1000).toISOString());
  }

  // Check user via getUser
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('User error:', userError);
  console.log('User from getUser:', user ? user.id : 'null');

  // Check local storage
  const localUserId = await getUserId();
  console.log('Local userId:', localUserId);

  console.log('======================');
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Fetch user profile from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<{ name: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      return { name: null, error };
    }

    return { name: data?.name || null, error: null };
  } catch (error) {
    console.error('Profile fetch exception:', error);
    return { name: null, error: error as Error };
  }
}

/**
 * Restore user session on app startup
 * Returns true if user is authenticated and data was restored
 */
export async function restoreUserSession(): Promise<{ authenticated: boolean; name: string | null }> {
  try {
    // Check for existing Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.log('No active session found');
      return { authenticated: false, name: null };
    }

    console.log('Active session found for user:', session.user.id);

    // Sync user ID to local storage
    await setUserId(session.user.id);

    // Fetch profile from Supabase
    const { name } = await fetchUserProfile(session.user.id);

    if (name) {
      // Restore local data
      await setUserName(name);
      await setOnboarded();
      console.log('User data restored:', name);
    }

    return { authenticated: true, name };
  } catch (error) {
    console.error('Failed to restore session:', error);
    return { authenticated: false, name: null };
  }
}

/**
 * Sign in with OAuth provider (Google or Apple)
 * Uses Expo WebBrowser auth session to handle the redirect flow inline.
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<{ user: AuthUser | null; error: Error | null; isNewUser: boolean }> {
  try {
    const redirectUrl = makeRedirectUri();

    // 1. Get the OAuth URL from Supabase (don't let it redirect)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      return { user: null, error: error || new Error('No OAuth URL returned'), isNewUser: false };
    }

    // 2. Open auth session in browser — waits for redirect back
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type !== 'success' || !result.url) {
      // User cancelled — not an error
      return { user: null, error: null, isNewUser: false };
    }

    // 3. Extract tokens from the redirect URL fragment
    const url = new URL(result.url);
    const params = new URLSearchParams(url.hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      return { user: null, error: new Error('Missing tokens in OAuth response'), isNewUser: false };
    }

    // 4. Establish the Supabase session
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError || !sessionData.user) {
      return { user: null, error: sessionError || new Error('Failed to set session'), isNewUser: false };
    }

    // 5. Store user ID + check for existing profile
    await setUserId(sessionData.user.id);

    const { name } = await fetchUserProfile(sessionData.user.id);
    let isNewUser = true;

    if (name) {
      // Returning user — sync profile data locally
      await setUserName(name);
      await setOnboarded();
      isNewUser = false;
    }

    return { user: { id: sessionData.user.id, email: sessionData.user.email }, error: null, isNewUser };
  } catch (error) {
    return { user: null, error: error as Error, isNewUser: false };
  }
}

/**
 * Delete user account and all associated data
 * This is required for App Store compliance
 */
export async function deleteAccount(): Promise<{ error: Error | null }> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return { error: new Error('No user logged in') };
    }

    // Delete user's journal entries
    const { error: journalError } = await supabase
      .from('journal_entries')
      .delete()
      .eq('user_id', userId);

    if (journalError) {
      console.error('Failed to delete journal entries:', journalError);
    }

    // Delete user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Failed to delete profile:', profileError);
    }

    // Delete encryption key (makes encrypted data unrecoverable)
    await deleteEncryptionKey();

    // Sign out and clear local data
    await supabase.auth.signOut();
    await clearUserId();
    await clearOnboarding();

    return { error: null };
  } catch (error) {
    console.error('Delete account exception:', error);
    return { error: error as Error };
  }
}
