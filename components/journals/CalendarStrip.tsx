import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import VoicesGuideIcon from '@/assets/images/voices-guide.svg';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { TRADITION_GRADIENTS, Tradition } from '@/utils/traditionAnalytics';

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  entriesPerDay?: Record<string, number>;
  traditionsPerDay?: Record<string, string[]>;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function CalendarStrip({
  selectedDate,
  onSelectDate,
  entriesPerDay = {},
  traditionsPerDay = {},
  expanded = false,
  onToggleExpanded,
}: CalendarStripProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  // Track the displayed month/year for expanded view
  const [displayedMonth, setDisplayedMonth] = useState(new Date());

  // Generate week dates centered on selected date
  const weekDates = useMemo(() => {
    const centerDate = selectedDate;
    const dates: Date[] = [];

    // Get 3 days before and 3 days after the selected date (7 day strip)
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, [selectedDate]);

  // Generate month dates for expanded view
  const monthDates = useMemo(() => {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday of the first week
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    // Generate 6 weeks of dates (42 days max for any month view)
    const dates: Date[] = [];
    const current = new Date(startDate);

    // Generate enough days to cover the month plus padding
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }, [displayedMonth]);

  const formatDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayNumber = (date: Date): string => {
    return date.getDate().toString();
  };

  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === displayedMonth.getMonth();
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setDisplayedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setDisplayedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleDayPress = (date: Date) => {
    onSelectDate(date);
  };

  const handleViewVoicesSummary = () => {
    router.push('/profile');
  };

  // Render tradition dots for a given date
  const renderTraditionDots = (dateKey: string, isSelectedDay: boolean) => {
    const traditions = traditionsPerDay[dateKey] || [];

    // If no traditions, show default empty circle
    if (traditions.length === 0) {
      return (
        <View style={styles.dotsContainer}>
          <View
            style={[
              styles.defaultDot,
              { borderColor: 'rgba(0,0,0,0.15)' },
            ]}
          />
        </View>
      );
    }

    // Show gradient tradition dots (max 3)
    return (
      <View style={styles.dotsContainer}>
        {traditions.slice(0, 3).map((tradition, index) => {
          const gradientColors = TRADITION_GRADIENTS[tradition as Tradition] || TRADITION_GRADIENTS.stoicism;
          return (
            <LinearGradient
              key={index}
              colors={gradientColors}
              style={styles.dot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          );
        })}
      </View>
    );
  };

  // Collapsed view - 7 day strip
  if (!expanded) {
    return (
      <View style={styles.container}>
        <View style={styles.glassContainer}>
          <BlurView intensity={20} tint="light" style={styles.blurView}>
            <LinearGradient
              colors={['rgba(255,251,245,0.92)', 'rgba(255,249,240,0.80)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.stripContainer}>
              <View style={styles.daysRow}>
                {weekDates.map((date, index) => {
                  const dateKey = getDateKey(date);
                  const selected = isSelected(date);
                  const today = isToday(date);

                  return (
                    <Pressable
                      key={index}
                      onPress={() => onSelectDate(date)}
                      style={({ pressed }) => [
                        styles.dayContainer,
                        pressed && {
                          opacity: 0.6,
                        },
                      ]}
                    >
                      {selected ? (
                        <LinearGradient
                          colors={['#FC9F4D', '#FAD689']}
                          style={styles.dayContentSelected}
                        >
                          <Text
                            style={[
                              styles.dayName,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayName(date)}
                          </Text>
                          <Text
                            style={[
                              styles.dayNumber,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayNumber(date)}
                          </Text>
                        </LinearGradient>
                      ) : today ? (
                        <LinearGradient
                          colors={['rgba(252,159,77,0.24)', 'rgba(250,214,137,0.24)']}
                          style={styles.dayContentToday}
                        >
                          <Text
                            style={[
                              styles.dayName,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayName(date)}
                          </Text>
                          <Text
                            style={[
                              styles.dayNumber,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayNumber(date)}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.dayContent}>
                          <Text
                            style={[
                              styles.dayName,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayName(date)}
                          </Text>
                          <Text
                            style={[
                              styles.dayNumber,
                              { color: '#282621' },
                            ]}
                          >
                            {formatDayNumber(date)}
                          </Text>
                        </View>
                      )}
                      {renderTraditionDots(dateKey, selected)}
                    </Pressable>
                  );
                })}
              </View>

              {/* Expand button */}
              <Pressable
                onPress={onToggleExpanded}
                style={({ pressed }) => [
                  styles.expandButton,
                  {
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </BlurView>
        </View>
      </View>
    );
  }

  // Expanded view - full month calendar
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.expandedGlassContainer}>
      <BlurView intensity={20} tint="light" style={styles.expandedBlurView}>
        <LinearGradient
          colors={['rgba(255,251,245,0.92)', 'rgba(255,249,240,0.80)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.expandedContainer}>
      {/* Month header with navigation */}
      <View style={styles.monthHeader}>
        {/* Spacer to balance collapse button */}
        <View style={styles.headerSpacer} />

        <View style={styles.monthNavGroup}>
          <Pressable
            onPress={goToPreviousMonth}
            style={({ pressed }) => [
              styles.monthNavButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>

          <Text
            style={[
              styles.monthTitle,
              {
                color: '#282621',
              },
            ]}
          >
            {formatMonthYear(displayedMonth)}
          </Text>

          <Pressable
            onPress={goToNextMonth}
            style={({ pressed }) => [
              styles.monthNavButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </Pressable>
        </View>

        <Pressable
          onPress={onToggleExpanded}
          style={({ pressed }) => [
            styles.collapseButton,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="chevron-up" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Day names header */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((name) => (
          <Text
            key={name}
            style={[
              styles.dayNameHeader,
              {
                color: '#282621',
              },
            ]}
          >
            {name}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {monthDates.map((date, index) => {
          const dateKey = getDateKey(date);
          const selected = isSelected(date);
          const today = isToday(date);
          const currentMonth = isCurrentMonth(date);

          return (
            <Pressable
              key={index}
              onPress={() => handleDayPress(date)}
              style={({ pressed }) => [
                styles.gridDayContainer,
                pressed && !selected && {
                  opacity: 0.6,
                },
              ]}
            >
              <View style={styles.gridDayNumberContainer}>
                {selected ? (
                  <LinearGradient
                    colors={['#FC9F4D', '#FAD689']}
                    style={styles.gridDaySelected}
                  >
                    <Text
                      style={[
                        styles.gridDayNumber,
                        {
                          color: '#282621',
                          fontFamily: 'Figtree-SemiBold',
                        },
                      ]}
                    >
                      {formatDayNumber(date)}
                    </Text>
                  </LinearGradient>
                ) : today ? (
                  <LinearGradient
                    colors={['rgba(252,159,77,0.24)', 'rgba(250,214,137,0.24)']}
                    style={styles.gridDayToday}
                  >
                    <Text
                      style={[
                        styles.gridDayNumber,
                        {
                          color: '#282621',
                          fontFamily: 'Figtree-SemiBold',
                        },
                      ]}
                    >
                      {formatDayNumber(date)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text
                    style={[
                      styles.gridDayNumber,
                      {
                        color: !currentMonth
                          ? 'rgba(40, 38, 33, 0.3)'
                          : '#282621',
                        fontFamily: 'Figtree-SemiBold',
                      },
                    ]}
                  >
                    {formatDayNumber(date)}
                  </Text>
                )}
              </View>
              {currentMonth && renderTraditionDots(dateKey, selected)}
            </Pressable>
          );
        })}
      </View>

      {/* View voices summary button */}
      <Pressable
        onPress={handleViewVoicesSummary}
        style={({ pressed }) => [
          styles.voicesSummaryButton,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <VoicesGuideIcon width={16} height={16} />
        <Text
          style={[
            styles.voicesSummaryText,
            {
              color: colors.text,
              fontFamily: fonts?.sansSemiBold,
            },
          ]}
        >
          View voices summary
        </Text>
      </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  glassContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurView: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 88,
  },
  stripContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  dayContent: {
    width: 32,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  dayContentSelected: {
    width: 32,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    overflow: 'hidden',
  },
  dayContentToday: {
    width: 32,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,159,77,0.8)',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Figtree-SemiBold',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 12,
    fontFamily: 'Figtree-SemiBold',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 6,
    height: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  defaultDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  expandButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  // Expanded view styles
  expandedGlassContainer: {
    margin: Spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
  },
  expandedBlurView: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  expandedContainer: {
    padding: Spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerSpacer: {
    width: 32,
  },
  monthNavGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthNavButton: {
    padding: Spacing.xs,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: 'Gambarino',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  dayNameHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Figtree-SemiBold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridDayContainer: {
    width: '14.28%', // 100% / 7 days
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 6,
  },
  gridDayNumberContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDaySelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridDayToday: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,159,77,0.8)',
  },
  gridDayNumber: {
    fontSize: 12,
    fontFamily: 'Figtree-SemiBold',
  },
  voicesSummaryButton: {
    marginTop: Spacing.sm,
    height: 40,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: 'rgba(40, 38, 33, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  voicesSummaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  collapseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
