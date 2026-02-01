import { supabase } from './supabase';
import { setUserId, clearUserId, getUserName, getUserId, setUserName, setOnboarded, clearOnboarding } from './storage';
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
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    const redirectUrl = makeRedirectUri();
    console.log('OAuth redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error(`${provider} OAuth error:`, error);
      return { user: null, error };
    }

    // OAuth flow will redirect back to the app
    // The session will be established automatically by Supabase
    console.log(`${provider} OAuth initiated:`, data);

    // Note: The actual user data will be available after the OAuth redirect completes
    // The calling component should listen for session changes or re-check auth state
    return { user: null, error: null };
  } catch (error) {
    console.error(`${provider} OAuth exception:`, error);
    return { user: null, error: error as Error };
  }
}

/**
 * Handle OAuth callback after redirect
 * Call this when the app is opened from OAuth redirect
 */
export async function handleOAuthCallback(): Promise<{ user: AuthUser | null; error: Error | null }> {
  try {
    // Get the current session after OAuth redirect
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('OAuth callback error:', error);
      return { user: null, error };
    }

    if (session?.user) {
      // Store user ID locally
      await setUserId(session.user.id);

      // Create or update profile with stored name if available
      const name = await getUserName();
      const email = session.user.email;

      if (name || email) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: session.user.id,
          name: name || null,
          email: email || null,
        });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
        }
      }

      return { user: { id: session.user.id, email: session.user.email }, error: null };
    }

    return { user: null, error: new Error('No session after OAuth callback') };
  } catch (error) {
    console.error('OAuth callback exception:', error);
    return { user: null, error: error as Error };
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
