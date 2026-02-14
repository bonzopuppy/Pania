import { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { Fonts } from '@/constants/theme';
import { getUserId } from '@/services/storage';
import SplashLogo from '@/assets/images/branding/splash-logo.svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPLASH_COLORS = {
  gradientTop: '#FC9F4D',
  gradientBottom: '#FAD689',
  text: '#573B2A',
};

const MIN_SPLASH_DURATION = 2000;
const FADE_OUT_DURATION = 600;

export default function Index() {
  const rotation = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const contentScale = useSharedValue(1);

  const navigate = useCallback((dest: string) => {
    router.replace(dest as any);
  }, []);

  const startTransition = useCallback((dest: '/welcome' | '/chat') => {
    contentOpacity.value = withTiming(0, {
      duration: FADE_OUT_DURATION,
      easing: Easing.out(Easing.cubic),
    }, (finished) => {
      if (finished) {
        runOnJS(navigate)(dest);
      }
    });
    contentScale.value = withTiming(0.92, {
      duration: FADE_OUT_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    const startTime = Date.now();

    async function prepare() {
      let dest: '/welcome' | '/chat' = '/welcome';
      try {
        const userId = await getUserId();
        if (userId) dest = '/chat';
      } catch (e) {
        console.error('Error checking auth:', e);
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_SPLASH_DURATION - elapsed);

      setTimeout(() => {
        startTransition(dest);
      }, remaining);
    }

    prepare();
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[SPLASH_COLORS.gradientTop, SPLASH_COLORS.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />
      <Reanimated.View style={[styles.content, contentAnimatedStyle]}>
        <Reanimated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <SplashLogo width={140} height={138} color={SPLASH_COLORS.text} />
        </Reanimated.View>
        <Text style={styles.title}>Pania</Text>
      </Reanimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.08,
  },
  logoContainer: {
    width: 140,
    height: 138,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    lineHeight: 58,
    fontFamily: Fonts.serif,
    fontWeight: '400',
    color: SPLASH_COLORS.text,
    textAlign: 'center',
  },
});
