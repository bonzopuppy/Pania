import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Passage } from '@/services/ai';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

const FigmaColors = {
  text: '#282621',
  textSecondary: 'rgba(40, 38, 33, 0.6)',
};

// Helper to convert hex to rgba for gradient
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ExpandedVoiceProps {
  voice: Passage;
  onSeeAnother: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export default function ExpandedVoice({
  voice,
  onSeeAnother,
  onSave,
  isSaving = false,
  isSaved = false,
}: ExpandedVoiceProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const traditionColors = Palette.traditions[voice.tradition as Tradition] || Palette.traditions.stoicism;

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        {/* Background with gradient */}
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.backgroundBase, { backgroundColor: '#FFFFFF' }]} />
          <LinearGradient
            colors={[hexToRgba(traditionColors.primary, 0.4), 'rgba(255, 255, 255, 0)']}
            style={styles.gradientOverlay}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.325 }}
          />
        </View>

        {/* Mini-pattern icon in top right */}
        <View style={styles.iconContainer}>
          <MiniPattern width={16} height={16} color={traditionColors.primary} />
        </View>

        <View style={styles.content}>
          {/* Thinker name */}
          <Text
            style={[
              styles.thinkerName,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {voice.thinker}
          </Text>

          {/* Thinker info */}
          <Text
            style={[
              styles.thinkerInfo,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.sansMedium,
              },
            ]}
          >
            {voice.role}
          </Text>

          {/* Quote */}
          <Text
            style={[
              styles.quoteText,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {voice.text}
          </Text>

          {/* Source */}
          {voice.source && (
            <Text
              style={[
                styles.sourceText,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansMedium,
                },
              ]}
            >
              – {voice.source}
            </Text>
          )}

          {/* Context */}
          <Text
            style={[
              styles.contextText,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.sansMedium,
              },
            ]}
          >
            {voice.context || 'This wisdom has been shared across generations.'}
          </Text>

          {/* Dotted Divider */}
          <View style={styles.dottedDivider}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>

          {/* Reflection Question Section */}
          <View style={styles.reflectionSection}>
            <Text
              style={[
                styles.reflectionLabel,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansMedium,
                },
              ]}
            >
              A question to sit with:
            </Text>

            <Text
              style={[
                styles.reflectionQuestion,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansMedium,
                },
              ]}
            >
              {voice.reflectionQuestion || 'How does this resonate with your situation?'}
            </Text>
          </View>

          {/* See another voice button */}
          <Pressable
            onPress={onSeeAnother}
            style={({ pressed }) => [
              styles.seeAnotherButton,
              pressed && styles.seeAnotherButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.seeAnotherText,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              See another voice
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    // Drop shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  iconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    padding: 24,
  },
  thinkerName: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
    paddingRight: 32,
  },
  thinkerInfo: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.6,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.6,
    marginBottom: 24,
  },
  contextText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  dottedDivider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    opacity: 0.2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: FigmaColors.text,
  },
  reflectionSection: {
    gap: 8,
    marginBottom: 24,
  },
  reflectionLabel: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.6,
  },
  reflectionQuestion: {
    fontSize: 16,
    lineHeight: 22,
  },
  seeAnotherButton: {
    height: 40,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: 'rgba(40, 38, 33, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAnotherButtonPressed: {
    backgroundColor: 'rgba(40, 38, 33, 0.04)',
  },
  seeAnotherText: {
    fontSize: 14,
    lineHeight: 19,
  },
});
