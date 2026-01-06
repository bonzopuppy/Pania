import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PROMPTS = [
  'Something happened today...',
  "I'm struggling with...",
  "I'm grateful for...",
  'I need perspective on...',
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function OpeningPromptScreen() {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const handlePromptPress = (prompt: string) => {
    setText(prompt);
  };

  const handleContinue = () => {
    if (text.trim()) {
      // Navigate to clarification screen (to be implemented)
      router.push({
        pathname: '/clarify',
        params: { input: text.trim() },
      });
    }
  };

  const isButtonDisabled = !text.trim();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Greeting */}
        <Text
          style={[
            styles.greeting,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {getGreeting()}, David.
        </Text>

        {/* Question */}
        <Text
          style={[
            styles.question,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          What&apos;s on your mind?
        </Text>

        {/* Text Input - grows to fill available space */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: colors.border,
            },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Start writing..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.textInput,
              {
                color: colors.text,
                fontFamily: fonts?.sans,
              },
            ]}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          <Text
            style={[
              styles.dividerText,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            or choose a prompt
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        </View>

        {/* Prompt Buttons */}
        <View style={styles.promptsContainer}>
          {PROMPTS.map((prompt, index) => (
            <Pressable
              key={index}
              onPress={() => handlePromptPress(prompt)}
              style={({ pressed }) => [
                styles.promptButton,
                {
                  backgroundColor: colors.backgroundInput,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                },
              ]}
            >
              <Text
                style={[
                  styles.promptText,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                {prompt}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Continue Button - always at bottom */}
        <Pressable
          onPress={handleContinue}
          disabled={isButtonDisabled}
          style={({ pressed }) => [
            styles.continueButton,
            {
              backgroundColor: colors.buttonPrimary,
              opacity: isButtonDisabled ? 0.4 : pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.continueButtonText,
              {
                color: colors.buttonText,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Continue
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  keyboardAvoid: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.greeting.fontSize,
    lineHeight: Typography.greeting.lineHeight,
    marginBottom: Spacing.sm,
  },
  question: {
    fontSize: Typography.question.fontSize,
    lineHeight: Typography.question.lineHeight,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    minHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    padding: Spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: Typography.label.fontSize,
  },
  promptsContainer: {
    gap: Spacing.sm,
  },
  promptButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  promptText: {
    fontSize: Typography.prompt.fontSize,
    lineHeight: Typography.prompt.lineHeight,
  },
  continueButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
});
