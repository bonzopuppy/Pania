import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Keyboard,
  InputAccessoryView,
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

const INPUT_ACCESSORY_ID = 'pania-input-accessory';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function OpeningPromptScreen() {
  const [text, setText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const handlePromptPress = (prompt: string) => {
    setText(prompt);
    inputRef.current?.focus();
  };

  const handleContinue = () => {
    if (text.trim()) {
      Keyboard.dismiss();
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

      {/* Text Input - fixed height, scrollable */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundInput,
            borderColor: colors.border,
          },
        ]}
      >
        <ScrollView
          style={styles.inputScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            ref={inputRef}
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
            onFocus={() => setIsKeyboardVisible(true)}
            onBlur={() => setIsKeyboardVisible(false)}
            inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined}
          />
        </ScrollView>
      </View>

      {/* Show prompts and button when keyboard is hidden */}
      {!isKeyboardVisible && (
        <>
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

          {/* Continue Button */}
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
        </>
      )}

      {/* iOS Keyboard Accessory - Continue button above keyboard */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
          <View
            style={[
              styles.accessoryContainer,
              {
                backgroundColor: colors.backgroundCard,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Pressable
              onPress={handleContinue}
              disabled={isButtonDisabled}
              style={({ pressed }) => [
                styles.accessoryButton,
                {
                  backgroundColor: colors.buttonPrimary,
                  opacity: isButtonDisabled ? 0.4 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.accessoryButtonText,
                  {
                    color: colors.buttonText,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
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
  inputScroll: {
    flex: 1,
  },
  textInput: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    padding: Spacing.md,
    minHeight: 100,
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
  accessoryContainer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  accessoryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  accessoryButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
});
