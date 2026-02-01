import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signUp, signIn, signInWithOAuth, type OAuthProvider } from '@/services/auth';
import { resetEverything } from '@/services/debug';

type SignupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'save' | 'gate' | 'journal' | 'profile'; // Different contexts for signup prompt
};

export default function SignupModal({ visible, onClose, onSuccess, mode = 'save' }: SignupModalProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Default to Sign In for profile/journal modes (returning user), Sign Up for others
  const [isSignUp, setIsSignUp] = useState(mode !== 'profile' && mode !== 'journal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Hidden dev reset - triple tap on title
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else if (result.user) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setLoading(true);
    try {
      const result = await signInWithOAuth(provider);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        // OAuth flow will redirect to browser and back
        // Session will be handled by the OAuth callback
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (mode !== 'gate') {
      onClose();
    }
    // If mode is 'gate', don't allow skipping
  };

  const handleTitlePress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 500) {
      tapCountRef.current += 1;
      if (tapCountRef.current >= 3) {
        Alert.alert(
          'Developer Reset',
          'This will clear ALL data including auth, local storage, and flow tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset All',
              style: 'destructive',
              onPress: async () => {
                await resetEverything();
                onClose();
              },
            },
          ]
        );
        tapCountRef.current = 0;
      }
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={mode === 'save' || mode === 'profile' ? onClose : undefined}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={mode === 'save' || mode === 'profile' ? onClose : undefined}>
        <BlurView intensity={80} style={styles.backdrop} tint={colorScheme}>
          <Pressable onPress={(e) => e.stopPropagation()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <View style={[styles.modal, { backgroundColor: colors.backgroundCard }]}>
              {/* Header - Triple tap to access dev reset */}
              <Pressable onPress={handleTitlePress}>
                <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.serif }]}>
                  {mode === 'gate' ? 'Welcome back' :
                   mode === 'profile' || mode === 'journal' ? 'Welcome back' :
                   'Create an account'}
                </Text>
              </Pressable>

              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {mode === 'gate'
                  ? 'To continue exploring wisdom, please sign in or create an account.'
                  : mode === 'journal'
                  ? 'Sign in to access your saved reflections.'
                  : mode === 'profile'
                  ? 'Sign in to your account or create a new one.'
                  : 'Save your reflections and continue your journey.'}
              </Text>

              {/* Social Sign-In Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  onPress={() => handleOAuthSignIn('apple')}
                  disabled={loading}
                  style={[
                    styles.socialButton,
                    { backgroundColor: colors.text, borderColor: colors.text },
                    loading && styles.submitButtonDisabled,
                  ]}
                >
                  <Text style={[styles.socialButtonText, { color: colors.background }]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  style={[
                    styles.socialButton,
                    { backgroundColor: colors.backgroundInput, borderColor: colors.border },
                    loading && styles.submitButtonDisabled,
                  ]}
                >
                  <Text style={[styles.socialButtonText, { color: colors.text }]}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>

              {/* Toggle between Sign Up / Sign In */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={() => setIsSignUp(true)}
                  style={[
                    styles.toggleButton,
                    isSignUp && { backgroundColor: colors.buttonPrimary },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      { color: isSignUp ? colors.buttonText : colors.textSecondary },
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsSignUp(false)}
                  style={[
                    styles.toggleButton,
                    !isSignUp && { backgroundColor: colors.buttonPrimary },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      { color: !isSignUp ? colors.buttonText : colors.textSecondary },
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email Input */}
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundInput,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />

              {/* Password Input */}
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundInput,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Password (min 6 characters)"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isSignUp ? 'password-new' : 'password'}
                editable={!loading}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.buttonPrimary },
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Skip Button (only for save mode, not for gate/profile/journal) */}
              {mode === 'save' && (
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={loading}>
                  <Text style={[styles.skipButtonText, { color: colors.textMuted }]}>
                    Skip for now
                  </Text>
                  <Text style={[styles.skipSubtext, { color: colors.textMuted }]}>
                    (won&apos;t save this reflection)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  modal: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  socialContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  socialButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  socialButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: Typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.md,
  },
  submitButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    minHeight: 48,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
  },
  skipSubtext: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.xs,
  },
});
