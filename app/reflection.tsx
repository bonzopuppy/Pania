import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

// Extended context for passages - in a real app this would come from a database
const PASSAGE_CONTEXT: Record<
  string,
  {
    dates?: string;
    context: string;
    reflectionQuestion: string;
  }
> = {
  'ma-med-12-4': {
    dates: '121-180 AD',
    context:
      'Marcus wrote this while leading Rome through war and plague. Even an emperor wrestled with caring too much what others thought.',
    reflectionQuestion:
      'If your own opinion of your idea matters more than your boss\'s — what do YOU think of it?',
  },
  'gal-1-10': {
    context:
      'Paul wrote this letter to early Christians in Galatia, defending his message against those who questioned his authority.',
    reflectionQuestion:
      'Whose approval are you seeking right now? And whose approval actually matters most to you?',
  },
  'rumi-prison': {
    dates: '1207-1273',
    context:
      'Rumi was a 13th-century Persian poet whose work explores themes of divine love, freedom, and the journey of the soul.',
    reflectionQuestion:
      'What door might be open for you right now that you haven\'t walked through?',
  },
  'tnh-letting-go': {
    dates: '1926-2022',
    context:
      'Thich Nhat Hanh was a Vietnamese Buddhist monk who taught mindfulness and peace for over 60 years.',
    reflectionQuestion:
      'What would you need to let go of to feel more free right now?',
  },
};

export default function ReflectionScreen() {
  const params = useLocalSearchParams<{
    passageId: string;
    tradition: Tradition;
    thinker: string;
    role: string;
    text: string;
    source: string;
    userInput: string;
    clarification: string;
  }>();

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const traditionColors = Palette.traditions[params.tradition || 'stoicism'];
  const passageContext = PASSAGE_CONTEXT[params.passageId || ''] || {
    context: 'This wisdom has been shared across generations.',
    reflectionQuestion: 'How does this resonate with your situation?',
  };

  const handleSaveToJournal = () => {
    // TODO: Implement journal saving
    alert('Saved to journal!');
  };

  const handleSeeAnother = () => {
    router.back();
  };

  const handleStartOver = () => {
    router.dismissAll();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thinker Header */}
        <Text
          style={[
            styles.thinkerName,
            {
              color: traditionColors.primary,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {params.thinker?.toUpperCase()}
        </Text>

        <Text
          style={[
            styles.thinkerInfo,
            {
              color: colors.textMuted,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {passageContext.dates ? `${passageContext.dates} · ` : ''}
          {params.role}
        </Text>

        {/* Quote */}
        <View
          style={[
            styles.quoteContainer,
            {
              borderLeftColor: traditionColors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.quoteText,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {params.text}
          </Text>

          {params.source && (
            <Text
              style={[
                styles.sourceText,
                {
                  color: colors.textMuted,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              — {params.source}
            </Text>
          )}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Context */}
        <Text
          style={[
            styles.contextText,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {passageContext.context}
        </Text>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Reflection Question */}
        <Text
          style={[
            styles.reflectionLabel,
            {
              color: colors.textMuted,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          A question to sit with:
        </Text>

        <Text
          style={[
            styles.reflectionQuestion,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {passageContext.reflectionQuestion}
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleSaveToJournal}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: traditionColors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: '#FFFFFF',
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Save to journal
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSeeAnother}
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            See another voice
          </Text>
        </Pressable>

        <Pressable onPress={handleStartOver}>
          <Text
            style={[
              styles.linkText,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Start over
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  thinkerName: {
    fontSize: Typography.label.fontSize,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  thinkerInfo: {
    fontSize: Typography.caption.fontSize,
    marginBottom: Spacing.lg,
  },
  quoteContainer: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quoteText: {
    fontSize: Typography.question.fontSize,
    lineHeight: Typography.question.lineHeight + 4,
  },
  sourceText: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  contextText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight + 2,
  },
  reflectionLabel: {
    fontSize: Typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  reflectionQuestion: {
    fontSize: Typography.question.fontSize,
    lineHeight: Typography.question.lineHeight + 2,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
  linkText: {
    fontSize: Typography.label.fontSize,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
