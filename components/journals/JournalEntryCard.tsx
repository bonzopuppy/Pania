import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { JournalEntry, ConversationData } from '@/services/journal';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress?: (entry: JournalEntry) => void;
  onContinue?: (entry: JournalEntry) => void;
}

export default function JournalEntryCard({ entry, onPress, onContinue }: JournalEntryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const isComplete = !!entry.thinker;
  const traditionColors = isComplete
    ? Palette.traditions[(entry.tradition as Tradition) || 'stoicism'] || Palette.traditions.stoicism
    : { primary: colors.textMuted, light: colors.backgroundInput };

  const conversationData = entry.conversation_data as ConversationData | null;
  const hasConversationData = conversationData && conversationData.messages.length > 0;

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress(entry);
      return;
    }

    // Always restore the conversation in the chat interface
    if (hasConversationData) {
      router.push(`/chat?restore=${entry.id}`);
    } else if (onContinue) {
      onContinue(entry);
    }
  };

  // Incomplete entry card (no voice selected)
  if (!isComplete) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.cardContainer,
          {
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.blurView}>
          <LinearGradient
            colors={['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.55)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardContent}>
            {/* Dashed border indicator for incomplete */}
            <View style={[styles.incompleteIndicator, { borderColor: colors.textMuted }]} />

            {/* Prompt section */}
            <View style={styles.promptSection}>
              <Text
                style={[
                  styles.promptLabel,
                  {
                    color: colors.textMuted,
                    fontFamily: fonts?.sansSemiBold,
                  },
                ]}
              >
                PROMPT
              </Text>
              <Text
                style={[
                  styles.promptText,
                  {
                    color: colors.text,
                    fontFamily: fonts?.sans,
                  },
                ]}
                numberOfLines={2}
              >
                {entry.user_input}
              </Text>
            </View>

            {/* Continue indicator */}
            <View style={styles.continueSection}>
              <Text
                style={[
                  styles.continueLabel,
                  {
                    color: colors.textMuted,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Incomplete
              </Text>
              <Text
                style={[
                  styles.continueAction,
                  {
                    color: colors.buttonPrimary,
                    fontFamily: fonts?.sansSemiBold,
                  },
                ]}
              >
                Tap to continue
              </Text>
            </View>
          </View>
        </BlurView>
      </Pressable>
    );
  }

  // Complete entry card (with voice selected)
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.cardContainer,
        {
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <BlurView intensity={20} tint="light" style={styles.blurView}>
        <LinearGradient
          colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.64)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardContent}>
          {/* Tradition indicator bar */}
          <View
            style={[
              styles.traditionIndicator,
              { backgroundColor: traditionColors.primary },
            ]}
          />

          {/* Prompt section (top) */}
          <View style={styles.promptSection}>
            <Text
              style={[
                styles.promptLabel,
                {
                  color: colors.textMuted,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              PROMPT
            </Text>
            <Text
              style={[
                styles.promptText,
                {
                  color: colors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
              numberOfLines={2}
            >
              {entry.user_input}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Thinker/Passage section (bottom) */}
          <View style={styles.voiceSection}>
            <Text
              style={[
                styles.thinkerName,
                {
                  color: traditionColors.primary,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
              numberOfLines={1}
            >
              {entry.thinker?.toUpperCase() || 'UNKNOWN'}
            </Text>
            <Text
              style={[
                styles.passagePreview,
                {
                  color: colors.text,
                  fontFamily: fonts?.serif,
                },
              ]}
              numberOfLines={2}
            >
              "{entry.passage_text || 'No passage saved'}"
            </Text>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  blurView: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.md,
  },
  traditionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  incompleteIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  promptSection: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  promptLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  promptText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  voiceSection: {
  },
  thinkerName: {
    fontSize: Typography.caption.fontSize,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  passagePreview: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  continueSection: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  continueLabel: {
    fontSize: Typography.caption.fontSize,
    marginBottom: 2,
  },
  continueAction: {
    fontSize: Typography.label.fontSize,
  },
});
