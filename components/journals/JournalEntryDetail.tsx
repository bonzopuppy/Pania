import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { JournalEntry, ConversationData } from '@/services/journal';
import ConversationReplay from './ConversationReplay';
import VoiceCardMini from './VoiceCardMini';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface JournalEntryDetailProps {
  entry: JournalEntry;
}

export default function JournalEntryDetail({ entry }: JournalEntryDetailProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const tradition = entry.tradition as Tradition | undefined;
  const traditionColors = tradition
    ? Palette.traditions[tradition]
    : Palette.traditions.stoicism;

  const conversationData = entry.conversation_data as ConversationData | null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // If we have conversation data, show the full replay
  if (conversationData && conversationData.messages.length > 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date header */}
        <View style={styles.dateHeader}>
          <Text
            style={[
              styles.dateText,
              {
                color: colors.textSecondary,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {formatDate(entry.created_at)} at {formatTime(entry.created_at)}
          </Text>
        </View>

        {/* Conversation replay */}
        <ConversationReplay
          conversationData={conversationData}
          tradition={tradition}
        />
      </ScrollView>
    );
  }

  // Fallback view for entries without conversation data (old entries)
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Date header */}
      <View style={styles.dateHeader}>
        <Text
          style={[
            styles.dateText,
            {
              color: colors.textSecondary,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {formatDate(entry.created_at)} at {formatTime(entry.created_at)}
        </Text>
      </View>

      {/* Legacy notice */}
      <View style={styles.legacyNotice}>
        <BlurView intensity={15} tint="light" style={styles.noticeBlur}>
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={StyleSheet.absoluteFill}
          />
          <Text
            style={[
              styles.noticeText,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            This entry was saved before conversation replay was available.
          </Text>
        </BlurView>
      </View>

      {/* User's prompt */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionLabel,
            {
              color: colors.textMuted,
              fontFamily: fonts?.sansSemiBold,
            },
          ]}
        >
          YOUR PROMPT
        </Text>
        <Text
          style={[
            styles.promptText,
            {
              color: colors.text,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {entry.user_input}
        </Text>
      </View>

      {/* Clarification if exists */}
      {entry.clarification && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sansSemiBold,
              },
            ]}
          >
            YOUR REFLECTION
          </Text>
          <Text
            style={[
              styles.promptText,
              {
                color: colors.text,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {entry.clarification}
          </Text>
        </View>
      )}

      {/* Selected passage */}
      {entry.passage_text && entry.thinker && (
        <VoiceCardMini
          voice={{
            id: entry.id,
            tradition: (entry.tradition as Tradition) || 'stoicism',
            thinker: entry.thinker,
            role: '',
            text: entry.passage_text,
            source: entry.source || undefined,
            context: entry.context || '',
            reflectionQuestion: entry.reflection_question || '',
          }}
          isSelected={true}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  dateHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.caption.fontSize,
  },
  legacyNotice: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  noticeBlur: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  noticeText: {
    fontSize: Typography.caption.fontSize,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.caption.fontSize,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  promptText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
});
