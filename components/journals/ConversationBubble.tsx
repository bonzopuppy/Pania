import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ConversationMessage } from '@/services/journal';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface ConversationBubbleProps {
  message: ConversationMessage;
  tradition?: Tradition;
}

export default function ConversationBubble({ message, tradition }: ConversationBubbleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const traditionColors = tradition
    ? Palette.traditions[tradition]
    : Palette.traditions.stoicism;

  const isUserMessage = message.type === 'user_input' || message.type === 'user_response';
  const isAIMessage = message.type === 'greeting' ||
    message.type === 'clarifying_question' ||
    message.type === 'voices_intro' ||
    message.type === 'reflection_acknowledgment';

  // Get display text
  const getText = (): string => {
    switch (message.type) {
      case 'greeting':
      case 'user_input':
      case 'user_response':
      case 'voices_intro':
      case 'reflection_acknowledgment':
        return message.text;
      case 'clarifying_question':
        return message.acknowledgment
          ? `${message.acknowledgment}\n\n${message.text}`
          : message.text;
      default:
        return '';
    }
  };

  // Skip voice_cards and selected_voice - these are handled by VoiceCardMini
  if (message.type === 'voice_cards' || message.type === 'selected_voice') {
    return null;
  }

  const text = getText();
  if (!text) return null;

  if (isUserMessage) {
    return (
      <View style={styles.userBubbleContainer}>
        <View style={styles.userBubble}>
          <LinearGradient
            colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)']}
            style={StyleSheet.absoluteFill}
          />
          <Text
            style={[
              styles.userText,
              {
                color: colors.text,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {text}
          </Text>
        </View>
      </View>
    );
  }

  if (isAIMessage) {
    return (
      <View style={styles.aiBubbleContainer}>
        <BlurView intensity={15} tint="light" style={styles.aiBubble}>
          <LinearGradient
            colors={[`${traditionColors.light}E6`, `${traditionColors.light}B3`]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.traditionAccent, { backgroundColor: traditionColors.primary }]} />
          <View style={styles.aiBubbleContent}>
            <Text
              style={[
                styles.aiText,
                {
                  color: colors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              {text}
            </Text>
          </View>
        </BlurView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  userBubbleContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  userBubble: {
    maxWidth: '80%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  userText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  aiBubbleContainer: {
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  aiBubble: {
    maxWidth: '85%',
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: 4,
    overflow: 'hidden',
  },
  traditionAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
  },
  aiBubbleContent: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingLeft: Spacing.md + 4, // Account for accent bar
  },
  aiText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
});
