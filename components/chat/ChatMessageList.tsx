import React, { useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Keyboard, Pressable, Platform } from 'react-native';
import { Spacing } from '@/constants/theme';
import { ChatMessage } from '@/contexts/ChatContext';
import { Passage } from '@/services/ai';
import ChatBubble from './ChatBubble';
import VoiceCardsRow from './VoiceCardsRow';
import ExpandedVoice from './ExpandedVoice';
import PromptChips from './PromptChips';

interface ChatMessageListProps {
  messages: ChatMessage[];
  userName?: string | null;
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
      return (
        <ExpandedVoice
          key={message.id}
          voice={message.voice}
          onSeeAnother={onSeeAnother}
          onSave={onSave}
          isSaving={isSaving}
          isSaved={isSaved}
        />
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
});
