import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DEFAULT_PROMPTS = [
  'Something happened today...',
  "I'm struggling with...",
  "I'm grateful for...",
  'I need perspective on...',
];

// Figma design colors for prompt chips
const FigmaColors = {
  text: '#282621',
  chipGradientStart: 'rgba(255, 255, 255, 0.48)', // White at 48% opacity
  chipGradientEnd: 'rgba(255, 255, 255, 0.80)', // White at 80% opacity
  labelText: 'rgba(40, 38, 33, 0.6)',
};

interface PromptChipsProps {
  prompts?: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  visible?: boolean;
}

export default function PromptChips({
  prompts = DEFAULT_PROMPTS,
  onSelect,
  disabled = false,
  visible = true,
}: PromptChipsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Label */}
      <Text
        style={[
          styles.labelText,
          {
            fontFamily: fonts?.sansMedium,
          },
        ]}
      >
        Enter your thoughts below or choose a prompt:
      </Text>

      {/* Vertical stack of prompt chips */}
      <View style={styles.chipsContainer}>
        {prompts.map((prompt, index) => (
          <Pressable
            key={index}
            onPress={() => !disabled && onSelect(prompt)}
            disabled={disabled}
            style={({ pressed }) => [
              styles.chipWrapper,
              {
                opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
                transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
              },
            ]}
          >
            <LinearGradient
              colors={[FigmaColors.chipGradientStart, FigmaColors.chipGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chip}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: FigmaColors.text,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                {prompt}
              </Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  labelText: {
    fontSize: 16,
    color: FigmaColors.text,
    marginBottom: Spacing.md,
  },
  chipsContainer: {
    gap: Spacing.sm,
  },
  chipWrapper: {
    alignSelf: 'flex-start',
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontSize: Typography.prompt.fontSize,
    lineHeight: Typography.prompt.lineHeight,
  },
});
