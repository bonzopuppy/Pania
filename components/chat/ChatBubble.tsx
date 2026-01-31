import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChatMessage } from '@/contexts/ChatContext';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

// Figma design colors
const FigmaColors = {
  text: '#282621',
  textSecondary: 'rgba(40, 38, 33, 0.6)',
  textMuted: 'rgba(40, 38, 33, 0.4)',
  userBubbleBackground: 'rgba(255, 255, 255, 0.64)',
};

interface ChatBubbleProps {
  message: ChatMessage;
  userName?: string | null;
}

export default function ChatBubble({ message, userName }: ChatBubbleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  // Determine if this is a user message (right-aligned with background)
  const isUserMessage = message.type === 'user_input' || message.type === 'user_response';

  // Render loading indicator
  if (message.type === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={FigmaColors.text} />
        {message.text && (
          <Text
            style={[
              styles.loadingText,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {message.text}
          </Text>
        )}
      </View>
    );
  }

  // Render greeting (special styling - matches Figma)
  if (message.type === 'greeting') {
    return (
      <View style={styles.greetingContainer}>
        <Text
          style={[
            styles.greetingText,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {message.text}
        </Text>
        <View style={styles.questionRow}>
          <MiniPattern width={24} height={24} />
          <Text
            style={[
              styles.questionText,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.sansSemiBold,
              },
            ]}
          >
            What's on your mind?
          </Text>
        </View>
      </View>
    );
  }

  // Render clarifying question with acknowledgment
  if (message.type === 'clarifying_question') {
    return (
      <View style={styles.systemContainer}>
        {message.acknowledgment && (
          <Text
            style={[
              styles.acknowledgmentText,
              {
                color: FigmaColors.text,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {message.acknowledgment}
          </Text>
        )}
        <Text
          style={[
            styles.questionPrompt,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {message.text}
        </Text>
      </View>
    );
  }

  // Render voices intro
  if (message.type === 'voices_intro') {
    return (
      <View style={styles.systemContainer}>
        <Text
          style={[
            styles.voicesIntroText,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {message.text}
        </Text>
      </View>
    );
  }

  // Render reflection acknowledgment
  if (message.type === 'reflection_acknowledgment') {
    return (
      <View style={styles.systemContainer}>
        <Text
          style={[
            styles.acknowledgmentText,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {message.text}
        </Text>
      </View>
    );
  }

  // Skip rendering for voice_cards and selected_voice - handled separately
  if (message.type === 'voice_cards' || message.type === 'selected_voice') {
    return null;
  }

  // Render user messages (right-aligned with background)
  // At this point, only user_input and user_response types remain
  return (
    <View style={styles.userMessageWrapper}>
      <View style={styles.userBubble}>
        <Text
          style={[
            styles.userText,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.sans,
            },
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.fontSize,
  },

  // Greeting
  greetingContainer: {
    marginBottom: Spacing.md,
  },
  greetingText: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },

  // System messages (left-aligned, no background)
  systemContainer: {
    marginBottom: Spacing.md,
    maxWidth: '90%',
  },
  systemText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  acknowledgmentText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.sm,
  },
  questionPrompt: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  voicesIntroText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },

  // User messages (right-aligned with background)
  userMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  userBubble: {
    maxWidth: '85%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: FigmaColors.userBubbleBackground,
  },
  userText: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
});
