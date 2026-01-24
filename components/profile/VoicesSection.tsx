import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { JournalEntry } from '@/services/journal';
import {
  getTraditionsSortedByCount,
  getTotalVoicesCount,
  TRADITION_NAMES,
  TRADITION_GRADIENTS,
  Tradition,
} from '@/utils/traditionAnalytics';

interface VoicesSectionProps {
  entries: JournalEntry[];
}

export default function VoicesSection({ entries }: VoicesSectionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const totalVoices = useMemo(() => getTotalVoicesCount(entries), [entries]);
  const traditionData = useMemo(() => getTraditionsSortedByCount(entries), [entries]);

  // Only show traditions that have at least 1 entry
  const traditionsWithEntries = traditionData.filter((t) => t.count > 0);

  if (totalVoices === 0) {
    return null; // Don't show section if no voices
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: fonts?.sansSemiBold,
            },
          ]}
        >
          Voices
        </Text>
        <Text
          style={[
            styles.totalCount,
            {
              color: colors.textMuted,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {totalVoices} {totalVoices === 1 ? 'Voice' : 'Voices'}
        </Text>
      </View>

      {/* Tradition list */}
      <View style={styles.list}>
        {traditionsWithEntries.map((item, index) => (
          <View key={item.tradition}>
            <View style={styles.row}>
              {/* Gradient dot */}
              <View style={styles.dotContainer}>
                <LinearGradient
                  colors={TRADITION_GRADIENTS[item.tradition]}
                  style={styles.dot}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>

              {/* Tradition name */}
              <Text
                style={[
                  styles.traditionName,
                  {
                    color: colors.text,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                {TRADITION_NAMES[item.tradition]}
              </Text>

              {/* Count */}
              <Text
                style={[
                  styles.count,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                {item.count}
              </Text>
            </View>

            {/* Divider (except for last item) */}
            {index < traditionsWithEntries.length - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.body.fontSize,
  },
  totalCount: {
    fontSize: Typography.caption.fontSize,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dotContainer: {
    width: 10,
    height: 10,
    marginRight: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  traditionName: {
    flex: 1,
    fontSize: Typography.body.fontSize,
  },
  count: {
    fontSize: Typography.body.fontSize,
    marginLeft: Spacing.sm,
  },
  divider: {
    height: 1,
    marginLeft: 10 + Spacing.sm, // Align with text after dot
  },
});
