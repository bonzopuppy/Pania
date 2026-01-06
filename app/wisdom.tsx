import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface Passage {
  id: string;
  tradition: Tradition;
  thinker: string;
  role: string;
  text: string;
  source?: string;
}

// Sample passages - in a real app these would come from an API/database
const SAMPLE_PASSAGES: Passage[] = [
  {
    id: 'ma-med-12-4',
    tradition: 'stoicism',
    thinker: 'Marcus Aurelius',
    role: 'Stoic philosopher',
    text: '"It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own."',
  },
  {
    id: 'gal-1-10',
    tradition: 'christianity',
    thinker: 'Paul the Apostle',
    role: 'Christian scripture',
    text: '"Am I now trying to win the approval of human beings, or of God?"',
    source: 'Galatians 1:10',
  },
  {
    id: 'rumi-prison',
    tradition: 'sufism',
    thinker: 'Rumi',
    role: 'Sufi poet',
    text: '"Why do you stay in prison when the door is so wide open?"',
  },
  {
    id: 'tnh-letting-go',
    tradition: 'buddhism',
    thinker: 'Thich Nhat Hanh',
    role: 'Buddhist teacher',
    text: '"Letting go gives us freedom, and freedom is the only condition for happiness."',
  },
];

export default function WisdomScreen() {
  const { input, clarification } = useLocalSearchParams<{
    input: string;
    clarification: string;
  }>();
  const [selectedPassage, setSelectedPassage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const handlePassagePress = (passageId: string) => {
    setSelectedPassage(selectedPassage === passageId ? null : passageId);
  };

  const handleExplore = () => {
    if (selectedPassage) {
      const passage = SAMPLE_PASSAGES.find((p) => p.id === selectedPassage);
      if (passage) {
        router.push({
          pathname: '/reflection',
          params: {
            passageId: passage.id,
            tradition: passage.tradition,
            thinker: passage.thinker,
            role: passage.role,
            text: passage.text,
            source: passage.source || '',
            userInput: input,
            clarification: clarification,
          },
        });
      }
    }
  };

  const getTraditionColors = (tradition: Tradition) => {
    return Palette.traditions[tradition];
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
      {/* Header */}
      <Text
        style={[
          styles.header,
          {
            color: colors.textSecondary,
            fontFamily: fonts?.serif,
          },
        ]}
      >
        Some voices on this:
      </Text>

      {/* Passage Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_PASSAGES.map((passage) => {
          const traditionColors = getTraditionColors(passage.tradition);
          const isSelected = selectedPassage === passage.id;

          return (
            <Pressable
              key={passage.id}
              onPress={() => handlePassagePress(passage.id)}
              style={({ pressed }) => [
                styles.passageCard,
                {
                  backgroundColor: isSelected
                    ? traditionColors.light
                    : colors.backgroundInput,
                  borderColor: isSelected ? traditionColors.primary : colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              {/* Left edge color bar */}
              <View
                style={[
                  styles.colorBar,
                  { backgroundColor: traditionColors.primary },
                ]}
              />

              <View style={styles.passageContent}>
                {/* Thinker name and role */}
                <View style={styles.thinkerRow}>
                  <Text
                    style={[
                      styles.thinkerName,
                      {
                        color: traditionColors.primary,
                        fontFamily: fonts?.sans,
                      },
                    ]}
                  >
                    {passage.thinker.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.thinkerRole,
                      {
                        color: colors.textMuted,
                        fontFamily: fonts?.sans,
                      },
                    ]}
                  >
                    {passage.role}
                  </Text>
                </View>

                {/* Quote */}
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: colors.text,
                      fontFamily: fonts?.serif,
                    },
                  ]}
                >
                  {passage.text}
                </Text>

                {/* Source if available */}
                {passage.source && (
                  <Text
                    style={[
                      styles.sourceText,
                      {
                        color: colors.textMuted,
                        fontFamily: fonts?.sans,
                      },
                    ]}
                  >
                    — {passage.source}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Prompt */}
      <Text
        style={[
          styles.prompt,
          {
            color: colors.textMuted,
            fontFamily: fonts?.serif,
          },
        ]}
      >
        Which of these lands for you today?
      </Text>

      {/* Explore Button - appears when selected */}
      {selectedPassage && (
        <Pressable
          onPress={handleExplore}
          style={({ pressed }) => {
            const traditionColors = getTraditionColors(
              SAMPLE_PASSAGES.find((p) => p.id === selectedPassage)?.tradition || 'stoicism'
            );
            return [
              styles.exploreButton,
              {
                backgroundColor: traditionColors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ];
          }}
        >
          <Text
            style={[
              styles.exploreButtonText,
              {
                color: '#FFFFFF',
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Explore this wisdom
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    fontSize: Typography.question.fontSize,
    lineHeight: Typography.question.lineHeight,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  passageCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  colorBar: {
    width: 6,
  },
  passageContent: {
    flex: 1,
    padding: Spacing.md,
  },
  thinkerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  thinkerName: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  thinkerRole: {
    fontSize: Typography.caption.fontSize,
  },
  quoteText: {
    fontSize: Typography.prompt.fontSize,
    lineHeight: Typography.prompt.lineHeight + 4,
  },
  sourceText: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.sm,
  },
  prompt: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: Typography.label.fontSize,
    marginVertical: Spacing.md,
  },
  exploreButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
});
