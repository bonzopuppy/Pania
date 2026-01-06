import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ClarifyScreen() {
  const { input } = useLocalSearchParams<{ input: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

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
          &ldquo;{input}&rdquo;
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* AI Response placeholder */}
      <Text
        style={[
          styles.aiResponse,
          {
            color: colors.textSecondary,
            fontFamily: fonts?.serif,
          },
        ]}
      >
        That sounds meaningful.
      </Text>

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

      {/* Placeholder for next screen implementation */}
      <Text
        style={[
          styles.placeholder,
          {
            color: colors.textMuted,
            fontFamily: fonts?.sans,
          },
        ]}
      >
        (Clarification flow coming soon)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  userInputCard: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
  },
  userInputText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xl,
  },
  aiResponse: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.md,
  },
  clarifyQuestion: {
    fontSize: Typography.question.fontSize,
    lineHeight: Typography.question.lineHeight,
  },
  placeholder: {
    marginTop: Spacing.xxl,
    fontSize: Typography.caption.fontSize,
    textAlign: 'center',
  },
});
