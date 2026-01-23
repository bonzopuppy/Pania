import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import AddIcon from '@/assets/images/add.svg';
import ProfileIcon from '@/assets/images/profile.svg';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserId } from '@/services/storage';
import { getJournalEntries, getTraditionsPerDay, JournalEntry } from '@/services/journal';
import SignupModal from '@/components/SignupModal';
import { CalendarStrip, JournalEntryCard } from '@/components/journals';

export default function JournalsScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarExpanded, setCalendarExpanded] = useState(false);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const loadEntries = async () => {
    const userId = await getUserId();
    setIsLoggedIn(!!userId);

    if (userId) {
      setIsLoading(true);
      try {
        const { entries: journalEntries, error } = await getJournalEntries();
        if (!error && journalEntries) {
          setEntries(journalEntries);
        }
      } catch (e) {
        console.error('Failed to load journal entries:', e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    loadEntries();
  };

  const handleOpenProfile = () => {
    router.push('/profile');
  };

  const handleEntryPress = (entry: JournalEntry) => {
    // Could navigate to a detail view in the future
    console.log('Entry pressed:', entry.id);
  };

  const handleNewChat = () => {
    // Navigate to chat - the chat screen will start fresh
    router.push('/chat');
  };

  // Calculate entries per day for calendar dots
  const entriesPerDay = useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach((entry) => {
      const dateKey = new Date(entry.created_at).toISOString().split('T')[0];
      map[dateKey] = (map[dateKey] || 0) + 1;
    });
    return map;
  }, [entries]);

  // Calculate traditions per day for colored calendar dots
  const traditionsPerDay = useMemo(() => {
    return getTraditionsPerDay(entries);
  }, [entries]);

  // Filter entries by selected date
  const filteredEntries = useMemo(() => {
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    return entries.filter((entry) => {
      const entryDateKey = new Date(entry.created_at).toISOString().split('T')[0];
      return entryDateKey === selectedDateKey;
    });
  }, [entries, selectedDate]);

  // Format selected date for display
  const formatSelectedDate = (): string => {
    const today = new Date();
    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Today';
    }

    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <JournalEntryCard entry={item} onPress={handleEntryPress} />
  );

  const renderEmptyState = () => {
    if (!isLoggedIn) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            Your journal awaits
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Sign up to save your reflections and revisit the wisdom that speaks to you.
          </Text>
          <Pressable
            onPress={() => setShowSignupModal(true)}
            style={({ pressed }) => [
              styles.signupButton,
              {
                backgroundColor: colors.buttonPrimary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.signupButtonText,
                {
                  color: colors.buttonText,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              Sign up
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyTitle,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          No entries for{'\n'}{formatSelectedDate()}
        </Text>
        <Text
          style={[
            styles.emptySubtitle,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          Complete a reflection to start your journal.
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Palette.journalsGradient.top, Palette.journalsGradient.bottom]}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
        mode="journal"
      />

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          My Journals
        </Text>

        <Pressable
          onPress={handleOpenProfile}
          style={({ pressed }) => [
            styles.profileButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ProfileIcon width={24} height={24} />
        </Pressable>
      </View>

      {/* Calendar Strip */}
      {isLoggedIn && (
        <CalendarStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          entriesPerDay={entriesPerDay}
          traditionsPerDay={traditionsPerDay}
          expanded={calendarExpanded}
          onToggleExpanded={() => setCalendarExpanded(!calendarExpanded)}
        />
      )}

      {/* Date label */}
      {isLoggedIn && !isLoading && filteredEntries.length > 0 && !calendarExpanded && (
        <Text
          style={[
            styles.dateLabel,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {formatSelectedDate()}
        </Text>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textMuted} />
        </View>
      ) : filteredEntries.length > 0 ? (
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Spacing.xl + 80 }, // Extra padding for floating button
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Floating new chat button */}
      {isLoggedIn && (
        <Pressable
          onPress={handleNewChat}
          style={({ pressed }) => [
            styles.newChatButton,
            {
              bottom: insets.bottom + Spacing.lg,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <BlurView
            intensity={60}
            tint="light"
            style={styles.newChatButtonBlur}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newChatButtonInner}
            >
              <AddIcon width={24} height={24} />
            </LinearGradient>
          </BlurView>
        </Pressable>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dateLabel: {
    fontSize: Typography.label.fontSize,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80, // Account for floating button to visually center
  },
  emptyTitle: {
    fontSize: Typography.question.fontSize,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
  },
  signupButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  signupButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
  // Floating new chat button styles
  newChatButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  newChatButtonBlur: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  newChatButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
