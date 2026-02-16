import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Keyboard, Pressable, Platform } from 'react-native';
import { Spacing, Fonts } from '@/constants/theme';
import { ChatMessage } from '@/contexts/ChatContext';
import { Passage } from '@/services/ai';
import ChatBubble from './ChatBubble';
import VoiceCardsRow from './VoiceCardsRow';
import ExpandedVoice from './ExpandedVoice';
import PromptChips from './PromptChips';

const FigmaColors = {
  text: '#282621',
};

interface ChatMessageListProps {
  messages: ChatMessage[];
  userName?: string | null;
  stage?: string;
  onSelectVoice: (voice: Passage) => void;
  onSeeAnother: () => void;
  onSave: () => void;
  onSelectPrompt?: (prompt: string) => void;
  onNoneSelected?: () => void;
  onBackgroundPress?: () => void;
  showPromptChips?: boolean;
  isSaving?: boolean;
  isSaved?: boolean;
  bottomInset?: number;
}

export default function ChatMessageList({
  messages,
  userName,
  stage,
  onSelectVoice,
  onSeeAnother,
  onSave,
  onSelectPrompt,
  onNoneSelected,
  onBackgroundPress,
  showPromptChips = false,
  isSaving = false,
  isSaved = false,
  bottomInset = 0,
}: ChatMessageListProps) {
  const fonts = Fonts;
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderMessage = (message: ChatMessage, index: number) => {
    // Handle voice_cards specially
    if (message.type === 'voice_cards') {
      return (
        <VoiceCardsRow
          key={message.id}
          voices={message.voices}
          onSelectVoice={onSelectVoice}
          onNoneSelected={onNoneSelected}
        />
      );
    }

    // Handle selected_voice specially
    if (message.type === 'selected_voice') {
      const reflectionText = message.voice.reflectionQuestion || 'How does this resonate with your situation?';
      // Only show "See another voice" before the user has reflected
      const canSeeAnother = stage === 'voice_selected';
      return (
        <View key={message.id}>
          <ExpandedVoice
            voice={message.voice}
            onSeeAnother={onSeeAnother}
            onSave={onSave}
            isSaving={isSaving}
            isSaved={isSaved}
            showSeeAnother={canSeeAnother}
          />
          {/* Follow-up question outside the card */}
          <View style={styles.followUpContainer}>
            <Text
              style={[
                styles.followUpLabel,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              A question to sit with:
            </Text>
            <Text
              style={[
                styles.followUpText,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              {reflectionText}
            </Text>
          </View>
        </View>
      );
    }

    // Render greeting with prompt chips inline (chips handle their own fade animation)
    if (message.type === 'greeting' && onSelectPrompt) {
      return (
        <View key={message.id}>
          <ChatBubble message={message} userName={userName} />
          <PromptChips onSelect={onSelectPrompt} visible={showPromptChips} />
        </View>
      );
    }

    // Render regular chat bubbles
    return (
      <ChatBubble
        key={message.id}
        message={message}
        userName={userName}
      />
    );
  };

  const handleBackgroundTap = () => {
    Keyboard.dismiss();
    onBackgroundPress?.();
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomInset + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
    >
      {messages.map((message, index) => renderMessage(message, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  followUpContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  followUpLabel: {
    fontSize: 16,
    lineHeight: 21.6,
    marginBottom: 4,
  },
  followUpText: {
    fontSize: 16,
    lineHeight: 21.6,
  },
});
