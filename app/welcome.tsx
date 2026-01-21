import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { signInWithOAuth, type OAuthProvider } from '@/services/auth';

// SVG imports
import PaniaPattern from '@/assets/images/pania-pattern.svg';
import GoogleLogo from '@/assets/images/Google_logo.svg';
import AppleLogo from '@/assets/images/apple_logo.svg';
import EmailIcon from '@/assets/images/email_icon.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma design colors - orange gradient background
const FigmaColors = {
  gradientTop: '#FC9F4D',
  gradientMid: '#FBBB6B', // Midpoint between top and bottom
  gradientBottom: '#FAD689',
  gradientTopTransparent: 'rgba(252, 159, 77, 0)', // gradientTop with 0 alpha
  text: '#282621',
  buttonBackground: 'rgba(255, 255, 255, 0.72)', // White at 72% opacity
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setLoading(true);
    try {
      const result = await signInWithOAuth(provider);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleEmailSignUp = () => {
    router.push('/signup-email');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: FigmaColors.gradientTop,
        },
      ]}
    >
      {/* Layer 1: Base gradient background */}
      <LinearGradient
        colors={[FigmaColors.gradientTop, FigmaColors.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 2: Decorative Pattern */}
      <View style={styles.patternContainer}>
        <PaniaPattern
          width={SCREEN_WIDTH * 1.3}
          height={SCREEN_HEIGHT * 0.56}
        />
      </View>

      {/* Layer 3: Gradient overlay - transparent at top, opaque at bottom */}
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

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Title */}
        <Text style={[styles.title, { fontFamily: Fonts.serif }]}>
          Welcome to Pania
        </Text>

        {/* Tagline */}
        <Text style={[styles.tagline, { fontFamily: Fonts.sansMedium }]}>
          Wisdom of the past,{'\n'}for your present.
        </Text>

        {/* OAuth Buttons */}
        <View style={styles.buttonsContainer}>
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
            <Text style={styles.oauthButtonText}>Continue with Google</Text>
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
            <Text style={styles.oauthButtonText}>Continue with Apple</Text>
          </Pressable>

          <Pressable
            onPress={handleEmailSignUp}
            disabled={loading}
            style={({ pressed }) => [
              styles.oauthButton,
              loading && styles.buttonDisabled,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.oauthIconContainer}>
              <EmailIcon width={20} height={20} fill={FigmaColors.text} />
            </View>
            <Text style={styles.oauthButtonText}>Sign up with Email</Text>
          </Pressable>
        </View>

        {loading && (
          <ActivityIndicator
            size="small"
            color={FigmaColors.text}
            style={styles.loader}
          />
        )}

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Pressable onPress={handleSignIn} disabled={loading}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.signInLink,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                Sign in
              </Text>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * -0.042, // -4.2% of screen height (from Figma: -36/852)
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 1.3) / 2,
    width: SCREEN_WIDTH * 1.3,
    height: SCREEN_HEIGHT * 0.56, // 56% of screen height (from Figma: 476/852)
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: SCREEN_HEIGHT * 0.25, // 25% from top (from Figma: 212/852) - title sits below most of the pattern
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '400',
    color: FigmaColors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight + 4,
    color: FigmaColors.text,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  buttonsContainer: {
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
    fontFamily: Fonts.sansSemiBold,
    color: FigmaColors.text,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loader: {
    marginTop: Spacing.lg,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
  signInText: {
    fontSize: Typography.label.fontSize,
    fontFamily: Fonts.sansMedium,
    color: FigmaColors.text,
  },
  signInLink: {
    fontSize: Typography.label.fontSize,
    fontFamily: Fonts.sansBold,
    color: FigmaColors.text,
  },
});
