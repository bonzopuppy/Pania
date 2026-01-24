import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Fonts, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ConversationData, ConversationMessage } from '@/services/journal';
import { Passage } from '@/services/ai';
import ConversationBubble from './ConversationBubble';
import VoiceCardMini from './VoiceCardMini';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

interface ConversationReplayProps {
  conversationData: ConversationData;
  tradition?: Tradition;
}

export default function ConversationReplay({ conversationData, tradition }: ConversationReplayProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const renderMessage = (message: ConversationMessage, index: number) => {
    // Handle voice cards - show a summary or skip
    if (message.type === 'voice_cards') {
      return (
        <View key={index} style={styles.voiceCardsInfo}>
          <Text
            style={[
              styles.voiceCardsText,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            {message.voices.length} voices offered
          </Text>
        </View>
      );
    }

    // Handle selected voice
    if (message.type === 'selected_voice') {
      return (
        <VoiceCardMini
          key={index}
          voice={message.voice}
          isSelected={true}
        />
      );
    }

    // Handle all other message types
    return (
      <ConversationBubble
        key={index}
        message={message}
        tradition={tradition}
      />
    );
  };

  return (
    <View style={styles.container}>
      {conversationData.messages.map((message, index) => renderMessage(message, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  voiceCardsInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  voiceCardsText: {
    fontSize: Typography.caption.fontSize,
    fontStyle: 'italic',
  },
});
