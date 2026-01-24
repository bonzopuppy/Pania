import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Passage } from '@/services/ai';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface VoiceCardMiniProps {
  voice: Passage;
  isSelected?: boolean;
}

export default function VoiceCardMini({ voice, isSelected = false }: VoiceCardMiniProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const traditionColors = Palette.traditions[voice.tradition as Tradition] || Palette.traditions.stoicism;

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blurView}>
        <LinearGradient
          colors={
            isSelected
              ? [`${traditionColors.primary}20`, `${traditionColors.primary}10`]
              : ['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.64)']
          }
          style={StyleSheet.absoluteFill}
        />

        {/* Tradition indicator bar */}
        <View
          style={[
            styles.traditionBar,
            { backgroundColor: traditionColors.primary },
          ]}
        />

        <View style={styles.content}>
          {/* Thinker info */}
          <View style={styles.header}>
            <Text
              style={[
                styles.thinkerName,
                {
                  color: traditionColors.primary,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              {voice.thinker}
            </Text>
            {voice.thinkerDates && (
              <Text
                style={[
                  styles.dates,
                  {
                    color: colors.textMuted,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                {voice.thinkerDates}
              </Text>
            )}
          </View>

          {/* Passage text */}
          <Text
            style={[
              styles.passage,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            "{voice.text}"
          </Text>

          {/* Source */}
          {voice.source && (
            <Text
              style={[
                styles.source,
                {
                  color: colors.textMuted,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              {voice.source}
            </Text>
          )}

          {/* Context */}
          <Text
            style={[
              styles.context,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {voice.context}
          </Text>

          {/* Reflection question */}
          <View
            style={[
              styles.reflectionContainer,
              { borderLeftColor: traditionColors.primary },
            ]}
          >
            <Text
              style={[
                styles.reflectionLabel,
                {
                  color: traditionColors.primary,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              Reflection
            </Text>
            <Text
              style={[
                styles.reflection,
                {
                  color: colors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              {voice.reflectionQuestion}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  traditionBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Spacing.md + 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  thinkerName: {
    fontSize: Typography.body.fontSize,
  },
  dates: {
    fontSize: Typography.caption.fontSize,
  },
  passage: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight * 1.1,
    marginBottom: Spacing.sm,
  },
  source: {
    fontSize: Typography.caption.fontSize,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  context: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight * 1.3,
    marginBottom: Spacing.md,
  },
  reflectionContainer: {
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
  },
  reflectionLabel: {
    fontSize: Typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  reflection: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontStyle: 'italic',
  },
});
