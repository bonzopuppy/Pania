/**
 * Configuration for Pania services
 *
 * For development, you can set your API key here.
 * For production, use environment variables or secure storage.
 */

// Set your Anthropic API key here for development
// In production, use expo-secure-store or a backend proxy
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

// Check if API key is configured
export const isAPIConfigured = () => {
  return ANTHROPIC_API_KEY.length > 0;
};
