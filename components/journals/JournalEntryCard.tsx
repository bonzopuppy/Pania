import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { JournalEntry, ConversationData } from '@/services/journal';
import PromptIcon from '@/assets/images/icons/prompt.svg';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

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
          {/* Match calendar background color */}
          <LinearGradient
            colors={['rgba(255,251,245,0.92)', 'rgba(255,249,240,0.80)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardContent}>
            {/* Prompt row */}
            <View style={styles.promptRow}>
              <PromptIcon width={16} height={16} color={colors.text} />
              <Text
                style={[
                  styles.promptText,
                  {
                    color: colors.text,
                    fontFamily: fonts?.sansMedium,
                  },
                ]}
                numberOfLines={2}
              >
                {entry.user_input}
              </Text>
            </View>

            {/* Incomplete thinker section */}
            <View style={[styles.thinkerContainer, styles.incompleteContainer]}>
              <Text
                style={[
                  styles.incompleteLabel,
                  {
                    color: colors.textMuted,
                    fontFamily: fonts?.sansMedium,
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
        {/* Match calendar background color */}
        <LinearGradient
          colors={['rgba(255,251,245,0.92)', 'rgba(255,249,240,0.80)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardContent}>
          {/* Prompt row */}
          <View style={styles.promptRow}>
            <PromptIcon width={16} height={16} color={colors.text} />
            <Text
              style={[
                styles.promptText,
                {
                  color: colors.text,
                  fontFamily: fonts?.sansMedium,
                },
              ]}
              numberOfLines={2}
            >
              {entry.user_input}
            </Text>
          </View>

          {/* Thinker container with gradient overlay - pure white background */}
          <View style={styles.thinkerContainer}>
            {/* Tradition gradient overlay with smooth transition */}
            <LinearGradient
              colors={[
                `${traditionColors.primary}40`, // 25% opacity at top
                `${traditionColors.primary}20`, // 12% opacity
                `${traditionColors.primary}08`, // 3% opacity
                'transparent',
              ]}
              locations={[0, 0.15, 0.35, 0.55]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.traditionGradient}
            />

            {/* Tradition icon in top-right */}
            <View style={styles.traditionIconContainer}>
              <MiniPattern width={16} height={16} color={traditionColors.primary} />
            </View>

            {/* Thinker name */}
            <Text
              style={[
                styles.thinkerName,
                {
                  color: colors.text,
                  fontFamily: fonts?.serif,
                },
              ]}
              numberOfLines={1}
            >
              {entry.thinker}
            </Text>

            {/* Quote text */}
            <Text
              style={[
                styles.quoteText,
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
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  promptText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  thinkerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Spacing.md,
    marginHorizontal: -Spacing.sm,
    overflow: 'hidden',
  },
  incompleteContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.15)',
    backgroundColor: 'transparent',
  },
  traditionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  traditionIconContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  thinkerName: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 9,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 22,
  },
  incompleteLabel: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
  },
  continueAction: {
    fontSize: 14,
    lineHeight: 20,
  },
});
