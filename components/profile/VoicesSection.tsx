import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Fonts, Spacing } from '@/constants/theme';
import { JournalEntry } from '@/services/journal';
import {
  getTraditionsSortedByCount,
  getTotalVoicesCount,
  TRADITION_NAMES,
  TRADITION_GRADIENTS,
} from '@/utils/traditionAnalytics';

// Profile-specific colors matching the profile screen
const ProfileColors = {
  cardGradient: {
    top: 'rgba(255, 255, 255, 0.88)',
    bottom: 'rgba(255, 255, 255, 0.64)',
  },
  text: '#282621',
  divider: 'rgba(40, 38, 33, 0.12)',
};

// Time period filter options
type TimePeriod = 'all' | 'weekly' | 'monthly' | 'yearly';

const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  all: 'All Journals',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

// Dropdown arrow icon (10x5px chevron from Figma)
function DropdownArrow({ color = '#282621' }: { color?: string }) {
  return (
    <Svg width={10} height={5} viewBox="0 0 10 5" fill="none">
      <Path
        d="M1 1L5 4L9 1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface VoicesSectionProps {
  entries: JournalEntry[];
}

export default function VoicesSection({ entries }: VoicesSectionProps) {
  const fonts = Fonts;
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter entries based on selected time period
  const filteredEntries = useMemo(() => {
    if (selectedPeriod === 'all') {
      return entries;
    }

    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return entries;
    }

    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startDate && entryDate <= now;
    });
  }, [entries, selectedPeriod]);

  const totalVoices = useMemo(() => getTotalVoicesCount(filteredEntries), [filteredEntries]);
  const traditionData = useMemo(() => getTraditionsSortedByCount(filteredEntries), [filteredEntries]);

  // Only show traditions that have at least 1 entry
  const traditionsWithEntries = traditionData.filter((t) => t.count > 0);

  // Check if there are any voices at all (unfiltered)
  const hasAnyVoices = useMemo(() => getTotalVoicesCount(entries) > 0, [entries]);

  if (!hasAnyVoices) {
    return null; // Don't show section if no voices at all
  }

  const handleSelectPeriod = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setShowDropdown(false);
  };

  return (
    <LinearGradient
      colors={[ProfileColors.cardGradient.top, ProfileColors.cardGradient.bottom]}
      style={styles.container}
    >
      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
          <Pressable style={styles.dropdownMenu} onPress={(e) => e.stopPropagation()}>
            {(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map((period) => (
              <Pressable
                key={period}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  selectedPeriod === period && styles.dropdownItemSelected,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => handleSelectPeriod(period)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { fontFamily: fonts?.sansMedium },
                  ]}
                >
                  {TIME_PERIOD_LABELS[period]}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: ProfileColors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          Voices
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.dropdownButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setShowDropdown(true)}
        >
          <Text
            style={[
              styles.dropdownButtonText,
              {
                color: ProfileColors.text,
                fontFamily: fonts?.sansSemiBold,
              },
            ]}
          >
            {TIME_PERIOD_LABELS[selectedPeriod]}
          </Text>
          <DropdownArrow color={ProfileColors.text} />
        </Pressable>
      </View>

      {/* Total count */}
      <Text
        style={[
          styles.totalCount,
          {
            color: ProfileColors.text,
            fontFamily: fonts?.sansMedium,
          },
        ]}
      >
        {totalVoices} {totalVoices === 1 ? 'Voice' : 'Voices'}
      </Text>

      {/* Percentage bar chart */}
      {totalVoices > 0 && (
        <View style={styles.barChart}>
          {traditionsWithEntries.map((item, index) => {
            const percentage = (item.count / totalVoices) * 100;
            return (
              <LinearGradient
                key={item.tradition}
                colors={TRADITION_GRADIENTS[item.tradition]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  styles.bar,
                  {
                    flex: percentage,
                    marginLeft: index === 0 ? 0 : 4,
                  },
                ]}
              />
            );
          })}
        </View>
      )}

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
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
              </View>

              {/* Tradition name */}
              <Text
                style={[
                  styles.traditionName,
                  {
                    color: ProfileColors.text,
                    fontFamily: fonts?.sansMedium,
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
                    color: ProfileColors.text,
                    fontFamily: fonts?.sansMedium,
                  },
                ]}
              >
                {item.count}
              </Text>
            </View>

            {/* Divider (except for last item) */}
            {index < traditionsWithEntries.length - 1 && (
              <View style={[styles.divider, { backgroundColor: ProfileColors.divider }]} />
            )}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownButtonText: {
    fontSize: 14,
    lineHeight: 17.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  dropdownMenu: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    height: 48,
    borderRadius: 100,
    backgroundColor: 'rgba(120, 120, 128, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(120, 120, 128, 0.24)',
  },
  dropdownItemText: {
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    color: '#000000',
  },
  totalCount: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  barChart: {
    flexDirection: 'row',
    height: 24,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bar: {
    height: 24,
    borderRadius: 4,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
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
    fontSize: 16,
    lineHeight: 21.6,
  },
  count: {
    fontSize: 16,
    lineHeight: 21.6,
    marginLeft: Spacing.sm,
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
});
