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
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ClarifyScreen() {
  const { input } = useLocalSearchParams<{ input: string }>();
  const [response, setResponse] = useState('');
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const handleContinue = () => {
    if (response.trim()) {
      router.push({
        pathname: '/wisdom',
        params: {
          input: input,
          clarification: response.trim(),
        },
      });
    }
  };

  const isButtonDisabled = !response.trim();

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
        {/* User's input displayed */}
        <View
          style={[
            styles.userInputCard,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.userInputText,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {input}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* AI Acknowledgment */}
        <Text
          style={[
            styles.aiAcknowledgment,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          That sounds meaningful.
        </Text>

        {/* AI Clarifying Question */}
        <Text
          style={[
            styles.clarifyQuestion,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          What&apos;s the feeling that comes up most strongly when you think about this?
        </Text>

        {/* Response Input - grows to fill space */}
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
            value={response}
            onChangeText={setResponse}
            placeholder="Share what comes to mind..."
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
            autoFocus
          />
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
  userInputCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  userInputText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  aiAcknowledgment: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.sm,
  },
  clarifyQuestion: {
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
