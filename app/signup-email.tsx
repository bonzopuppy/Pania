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
import { signUp } from '@/services/auth';
import { clearAllData } from '@/services/storage';

// SVG imports
import PaniaPattern from '@/assets/images/pania-pattern.svg';
import CloseIcon from '@/assets/images/close_icon.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma design colors - same as other auth screens
const FigmaColors = {
  gradientTop: '#FC9F4D',
  gradientMid: '#FBBB6B',
  gradientBottom: '#FAD689',
  gradientTopTransparent: 'rgba(252, 159, 77, 0)',
  text: '#282621',
  buttonBackground: 'rgba(255, 255, 255, 0.72)',
  inputBackground: '#282621',
  inputText: '#FFFFFF',
  checkboxBorder: '#282621',
};

export default function SignUpEmailScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms of Service to continue');
      return;
    }

    setLoading(true);

    try {
      // Clear any existing user data before creating new account
      await clearAllData();

      const result = await signUp(email, password);

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else if (result.user) {
        // New users go to onboarding to enter their name
        router.replace('/onboarding-name');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
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

      {/* Close Button */}
      <Pressable
        onPress={handleClose}
        style={[styles.closeButton, { top: insets.top + Spacing.md }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {({ pressed }) => (
          <View style={[styles.closeButtonCircle, { opacity: pressed ? 0.7 : 1 }]}>
            <CloseIcon
              width={12}
              height={12}
              stroke={FigmaColors.text}
            />
          </View>
        )}
      </Pressable>

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
            Sign up with Email
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { fontFamily: Fonts.sansMedium }]}>
            Create an account to start your journey
          </Text>

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
              autoComplete="password-new"
              editable={!loading}
            />
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            style={({ pressed }) => [
              styles.signUpButton,
              loading && styles.buttonDisabled,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={FigmaColors.text} />
            ) : (
              <Text style={[styles.signUpButtonText, { fontFamily: Fonts.sansSemiBold }]}>
                Sign up
              </Text>
            )}
          </Pressable>

          {/* Terms Checkbox */}
          <Pressable
            onPress={() => setTermsAccepted(!termsAccepted)}
            disabled={loading}
            style={styles.termsContainer}
          >
            <View
              style={[
                styles.checkbox,
                termsAccepted && styles.checkboxChecked,
              ]}
            >
              {termsAccepted && (
                <View style={styles.checkboxInner} />
              )}
            </View>
            <Text style={[styles.termsText, { fontFamily: Fonts.sansMedium }]}>
              By checking this box, you are agreeing to our{' '}
              <Text
                style={{ fontFamily: Fonts.sansBold, textDecorationLine: 'underline' }}
                onPress={() => router.push('/terms-of-service')}
              >
                Terms of Service
              </Text>.
            </Text>
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
  closeButton: {
    position: 'absolute',
    right: Spacing.xl,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FigmaColors.buttonBackground,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 313,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: FigmaColors.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: FigmaColors.text,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: FigmaColors.text,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    color: FigmaColors.text,
  },
  signUpButton: {
    width: '100%',
    maxWidth: 313,
    backgroundColor: FigmaColors.buttonBackground,
    borderRadius: 64,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    color: FigmaColors.text,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
