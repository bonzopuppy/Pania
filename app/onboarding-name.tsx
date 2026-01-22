import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Spacing } from '@/constants/theme';
import { setUserName, setOnboarded } from '@/services/storage';

// Figma design colors - green gradient
const FigmaColors = {
  gradientTop: '#86C166',
  gradientBottom: '#A8D8B9',
  text: '#282621',
};

export default function OnboardingNameScreen() {
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animate content in
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

    // Focus input after animation
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 900);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  const handleContinue = async () => {
    if (name.trim()) {
      try {
        await setUserName(name.trim());
        await setOnboarded();
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error saving name:', error);
      }
    }
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
      {/* Background gradient */}
      <LinearGradient
        colors={[FigmaColors.gradientTop, FigmaColors.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />

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
          What should{'\n'}we call you?
        </Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={`${FigmaColors.text}66`} // 40% opacity
            style={[styles.nameInput, { fontFamily: Fonts.sansSemiBold }]}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            selectionColor="#FFE33C"
          />
          <View style={styles.underline} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 136, // Positioned to match Figma
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '400',
    color: FigmaColors.text,
    marginBottom: 129, // Space between title and input from Figma
  },
  inputContainer: {
    width: '100%',
  },
  nameInput: {
    fontSize: 24,
    lineHeight: 32,
    color: FigmaColors.text,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  underline: {
    height: 1,
    backgroundColor: FigmaColors.text,
    opacity: 0.6,
    marginTop: 8,
  },
});
