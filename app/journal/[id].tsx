import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Fonts, Typography, Spacing, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getJournalEntry, JournalEntry, ConversationData } from '@/services/journal';
import { JournalEntryDetail } from '@/components/journals';

export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    if (!id) {
      setError('No entry ID provided');
      setIsLoading(false);
      return;
    }

    try {
      const { entry: journalEntry, error: fetchError } = await getJournalEntry(id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setEntry(journalEntry);
      }
    } catch (e) {
      setError('Failed to load entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!entry) return;

    // Navigate to chat with restore parameter
    router.push(`/chat?restore=${entry.id}`);
  };

  // Check if entry is incomplete (no voice selected)
  const isIncomplete = entry && !entry.thinker;
  const conversationData = entry?.conversation_data as ConversationData | null;
  const hasConversationData = conversationData && conversationData.messages.length > 0;

  return (
    <LinearGradient
      colors={[Palette.journalsGradient.top, Palette.journalsGradient.bottom]}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          Journal Entry
        </Text>

        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.textMuted} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.errorText,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      ) : entry ? (
        <>
          <JournalEntryDetail entry={entry} />

          {/* Continue button for incomplete entries */}
          {isIncomplete && hasConversationData && (
            <View style={styles.continueContainer}>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.continueButton,
                  {
                    backgroundColor: colors.buttonPrimary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.continueText,
                    {
                      color: colors.buttonText,
                      fontFamily: fonts?.sansSemiBold,
                    },
                  ]}
                >
                  Continue Conversation
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.buttonText} />
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.errorText,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Entry not found
          </Text>
        </View>
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
  headerButton: {
    padding: Spacing.xs,
    width: 40,
  },
  title: {
    fontSize: Typography.question.fontSize,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
  },
  continueContainer: {
    padding: Spacing.lg,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 9999,
    gap: Spacing.sm,
  },
  continueText: {
    fontSize: Typography.button.fontSize,
  },
});
