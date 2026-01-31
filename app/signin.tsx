import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Typography, Spacing } from '@/constants/theme';
import { signIn } from '@/services/auth';

type OAuthProvider = 'google' | 'apple';

// SVG imports
import PaniaPattern from '@/assets/images/patterns/pania-pattern.svg';
import GoogleLogo from '@/assets/images/auth/Google_logo.svg';
import AppleLogo from '@/assets/images/auth/apple_logo.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma design colors - same as welcome screen
const FigmaColors = {
  gradientTop: '#FC9F4D',
  gradientMid: '#FBBB6B',
  gradientBottom: '#FAD689',
  gradientTopTransparent: 'rgba(252, 159, 77, 0)',
  text: '#282621',
  buttonBackground: 'rgba(255, 255, 255, 0.72)',
  inputBackground: '#282621',
  inputText: '#FFFFFF',
};

export default function SignInScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Pattern rotation animation
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 60000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const patternAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else if (result.user) {
        router.replace('/chat');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: OAuthProvider) => {
    Alert.alert(
      'Coming Soon',
      `Sign in with ${provider === 'google' ? 'Google' : 'Apple'} will be available soon.`
    );
  };

  const handleCreateAccount = () => {
    router.replace('/welcome');
  };

  const handleInputFocus = () => {
    // Scroll down to center the form when keyboard opens
    scrollViewRef.current?.scrollTo({ y: 150, animated: true });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Layer 1: Base gradient background */}
      <LinearGradient
        colors={[FigmaColors.gradientTop, FigmaColors.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 2: Decorative Pattern */}
      <Reanimated.View style={[styles.patternContainer, patternAnimatedStyle]}>
        <PaniaPattern
          width={SCREEN_WIDTH * 1.3}
          height={SCREEN_HEIGHT * 0.56}
        />
      </Reanimated.View>

      {/* Layer 3: Gradient overlay */}
      <LinearGradient
        colors={[
          FigmaColors.gradientTopTransparent,
          FigmaColors.gradientTopTransparent,
          FigmaColors.gradientMid,
          FigmaColors.gradientBottom,
        ]}
        locations={[0, 0.2, 0.38, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
          <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { fontFamily: Fonts.serif }]}>
            Welcome back{'\n'}to Pania
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { fontFamily: Fonts.sansMedium }]}>
            Sign in to continue your journey
          </Text>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <Pressable
              onPress={() => handleOAuthSignIn('google')}
              disabled={loading}
              style={({ pressed }) => [
                styles.oauthButton,
                loading && styles.buttonDisabled,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.oauthIconContainer}>
                <GoogleLogo width={20} height={20} fill={FigmaColors.text} />
              </View>
              <Text style={[styles.oauthButtonText, { fontFamily: Fonts.sansSemiBold }]}>
                Continue with Google
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleOAuthSignIn('apple')}
              disabled={loading}
              style={({ pressed }) => [
                styles.oauthButton,
                loading && styles.buttonDisabled,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.oauthIconContainer}>
                <AppleLogo width={16} height={20} fill={FigmaColors.text} />
              </View>
              <Text style={[styles.oauthButtonText, { fontFamily: Fonts.sansSemiBold }]}>
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={[styles.dividerText, { fontFamily: Fonts.sans }]}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { fontFamily: Fonts.sansMedium }]}
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              value={email}
              onChangeText={setEmail}
              onFocus={handleInputFocus}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { fontFamily: Fonts.sansMedium }]}
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              value={password}
              onChangeText={setPassword}
              onFocus={handleInputFocus}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
            />
          </View>

          {/* Sign In Button */}
          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            style={({ pressed }) => [
              styles.signInButton,
              loading && styles.buttonDisabled,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={FigmaColors.text} />
            ) : (
              <Text style={[styles.signInButtonText, { fontFamily: Fonts.sansSemiBold }]}>
                Sign in
              </Text>
            )}
          </Pressable>
        </View>

        {/* Create Account Link */}
          <View style={styles.createAccountContainer}>
            <Text style={[styles.createAccountText, { fontFamily: Fonts.sansMedium }]}>
              Don't have an account?
            </Text>
            <Pressable onPress={handleCreateAccount} disabled={loading}>
              {({ pressed }) => (
                <Text
                  style={[
                    styles.createAccountLink,
                    { fontFamily: Fonts.sansBold, opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  Create one
                </Text>
              )}
            </Pressable>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.042,
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 1.3) / 2,
    width: SCREEN_WIDTH * 1.3,
    height: SCREEN_HEIGHT * 0.56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '400',
    color: FigmaColors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight + 4,
    color: FigmaColors.text,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 313,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: 'rgba(40, 38, 33, 0.48)', // #282621 at 48% opacity
    borderRadius: 64,
    height: 48,
    paddingHorizontal: 20,
    fontSize: 16,
    color: FigmaColors.inputText,
  },
  signInButton: {
    width: '100%',
    maxWidth: 313,
    backgroundColor: FigmaColors.buttonBackground,
    borderRadius: 64,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  signInButtonText: {
    fontSize: 16,
    color: FigmaColors.text,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 313,
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: FigmaColors.text,
    opacity: 0.12,
  },
  dividerText: {
    fontSize: Typography.label.fontSize,
    color: FigmaColors.text,
  },
  oauthContainer: {
    gap: Spacing.md,
    width: '100%',
    maxWidth: 313,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FigmaColors.buttonBackground,
    borderRadius: 64,
    height: 48,
    position: 'relative',
  },
  oauthIconContainer: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  oauthButtonText: {
    fontSize: 16,
    color: FigmaColors.text,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  createAccountText: {
    fontSize: Typography.label.fontSize,
    color: FigmaColors.text,
  },
  createAccountLink: {
    fontSize: Typography.label.fontSize,
    color: FigmaColors.text,
  },
});
