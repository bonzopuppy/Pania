import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Keyboard, Alert, Modal, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useChat, ChatStage } from '@/contexts/ChatContext';
import { aiService, Passage } from '@/services/ai';
import { getUserName, getUserId, clearOnboarding } from '@/services/storage';
import { saveJournalEntry, CreateJournalEntryParams } from '@/services/journal';
import { resetEverything } from '@/services/debug';
import { router } from 'expo-router';
import SignupModal from '@/components/SignupModal';

import ChatMessageList from './ChatMessageList';
import ChatInput, { ChatInputRef } from './ChatInput';

// Figma design colors - cream/peach gradient background (from Prompt screen)
const FigmaColors = {
  gradientTop: '#FFD494',
  gradientBottom: '#FFEFC8',
};

interface ChatContainerProps {
  onOpenJournals?: () => void;
}

export default function ChatContainer({ onOpenJournals }: ChatContainerProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const {
    state,
    addGreeting,
    submitUserInput,
    addClarifyingQuestion,
    submitUserResponse,
    submitReflection,
    addReflectionAcknowledgment,
    addVoicesIntro,
    showVoiceCards,
    selectVoice,
    seeAnotherVoice,
    prepareForMoreVoices,
    setLoading,
    setSaved,
    setError,
    setStage,
    addShownThinkers,
  } = useChat();

  const [userName, setUserName] = useState<string | null>(null);
  const [userNameLoaded, setUserNameLoaded] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [voices, setVoices] = useState<Passage[]>([]);

  // For triple-tap dev menu
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  // Ref for chat input
  const chatInputRef = useRef<ChatInputRef>(null);

  // Load user name on mount (with dev fallback)
  useEffect(() => {
    getUserName().then((name) => {
      // Use fallback name for development if none is set
      setUserName(name || 'Friend');
      setUserNameLoaded(true);
    });
  }, []);

  // Initialize greeting only after userName is loaded
  useEffect(() => {
    if (userNameLoaded && state.messages.length === 0) {
      addGreeting(userName);
    }
  }, [userNameLoaded, userName, state.messages.length, addGreeting]);

  // Track keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Handle stage transitions - API calls
  useEffect(() => {
    if (state.stage === 'loading_clarify') {
      fetchClarifyingQuestion();
    } else if (state.stage === 'loading_voices') {
      fetchWisdomPassages();
    } else if (state.stage === 'generating_acknowledgment') {
      generateReflectionAcknowledgment();
    }
  }, [state.stage]);

  const fetchClarifyingQuestion = async () => {
    setLoading(true, 'Thinking...');
    try {
      const response = await aiService.getClarifyingQuestion(state.userInput);
      setLoading(false);
      addClarifyingQuestion(response.acknowledgment, response.question);
    } catch (error) {
      setLoading(false);
      setError('Failed to get response. Please try again.');
      // Fallback
      addClarifyingQuestion(
        'That sounds meaningful.',
        'What feeling comes up most strongly when you think about this?'
      );
    }
  };

  const fetchWisdomPassages = async () => {
    setLoading(true, 'Finding wisdom...');
    try {
      const response = await aiService.getWisdomPassages(state.userInput, state.clarification);
      setLoading(false);
      setVoices(response.passages);
      addShownThinkers(response.passages.map(p => p.thinker));  // Track what we showed
      addVoicesIntro('Here are some voices that might speak to your situation:');
      showVoiceCards(response.passages);
    } catch (error) {
      setLoading(false);
      setError('Failed to find wisdom. Please try again.');
    }
  };

  const generateReflectionAcknowledgment = async () => {
    setLoading(true, 'Reflecting...');
    try {
      const response = await aiService.getReflectionAcknowledgment(
        state.userInput,
        state.selectedVoice!,
        state.clarification
      );
      setLoading(false);
      addReflectionAcknowledgment(response.acknowledgment);
    } catch (error) {
      setLoading(false);
      addReflectionAcknowledgment("Thank you for sharing that reflection.\n\nWould you like to hear more voices on this?");
    }
  };

  const handlePromptSelect = (prompt: string) => {
    // Populate the input field instead of submitting directly
    chatInputRef.current?.setText(prompt);
  };

  const handleSubmit = async (text: string) => {
    if (state.stage === 'awaiting_input') {
      submitUserInput(text);
    } else if (state.stage === 'awaiting_response') {
      submitUserResponse(text);
    } else if (state.stage === 'showing_voices') {
      // User is asking about the cards or providing more context
      // Treat as additional clarification and fetch new voices
      submitUserResponse(text);
    } else if (state.stage === 'voice_selected') {
      // User is adding their reflections after selecting a voice
      submitReflection(text);
    } else if (state.stage === 'reflection_acknowledged') {
      // Use AI to classify user intent
      setLoading(true, 'Understanding...');
      try {
        const classification = await aiService.classifyIntent(text);
        setLoading(false);

        if (classification.intent === 'wants_more_voices') {
          handleFetchMoreVoices();
        } else {
          submitReflection(text);
        }
      } catch (error) {
        setLoading(false);
        // Fallback: treat as continued reflection
        submitReflection(text);
      }
    }
  };

  const handleSelectVoice = (voice: Passage) => {
    selectVoice(voice);
    // Auto-save when selecting a voice (if logged in)
    handleAutoSave(voice);
  };

  const handleAutoSave = async (voice: Passage) => {
    const userId = await getUserId();
    if (!userId) {
      // Not logged in - will prompt on explicit save
      return;
    }

    // Auto-save for logged-in users
    setIsSaving(true);
    try {
      const params: CreateJournalEntryParams = {
        userInput: state.userInput,
        clarification: state.clarification,
        tradition: voice.tradition,
        thinker: voice.thinker,
        passageText: voice.text,
        source: voice.source,
        context: voice.context,
        reflectionQuestion: voice.reflectionQuestion,
      };

      const { error } = await saveJournalEntry(params);
      if (!error) {
        setSaved(true);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    const userId = await getUserId();

    if (!userId) {
      // Not logged in - show signup modal
      setShowSignupModal(true);
      return;
    }

    if (state.isSaved) {
      // Already saved
      return;
    }

    // Save entry
    setIsSaving(true);
    try {
      if (!state.selectedVoice) return;

      const params: CreateJournalEntryParams = {
        userInput: state.userInput,
        clarification: state.clarification,
        tradition: state.selectedVoice.tradition,
        thinker: state.selectedVoice.thinker,
        passageText: state.selectedVoice.text,
        source: state.selectedVoice.source,
        context: state.selectedVoice.context,
        reflectionQuestion: state.selectedVoice.reflectionQuestion,
      };

      const { error } = await saveJournalEntry(params);
      if (error) {
        Alert.alert('Error', `Failed to save: ${error.message}`);
      } else {
        setSaved(true);
        Alert.alert('Saved!', 'Your reflection has been saved to your journal.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignupSuccess = async () => {
    setShowSignupModal(false);
    // After signup, save the entry
    await handleSave();
  };

  // Build conversation context for fetching new voices
  const buildConversationContext = (): string => {
    // Extract key user messages and reflections from state.messages
    const relevantMessages = state.messages
      .filter(m => m.type === 'user_response' || m.type === 'user_input')
      .map(m => (m as { text: string }).text);

    if (state.selectedVoice) {
      return `User has engaged with wisdom from ${state.selectedVoice.thinker}. Their reflections: ${relevantMessages.slice(-3).join(' | ')}`;
    }
    return relevantMessages.slice(-3).join(' | ');
  };

  // Go back to showing the SAME set of voice cards (before reflection)
  const handleSeeAnotherFromSameSet = () => {
    seeAnotherVoice();
    showVoiceCards(voices);
  };

  // Fetch NEW voices with full context (after reflection)
  const handleFetchMoreVoices = async () => {
    // Collapse the current voice but keep it in chat history
    prepareForMoreVoices();

    // Fetch NEW voices with full context
    setLoading(true, 'Finding more wisdom...');
    try {
      const context = buildConversationContext();
      const response = await aiService.getWisdomPassages(
        state.userInput,
        state.clarification,
        context,
        state.shownThinkers  // Exclude previously shown thinkers
      );
      setLoading(false);
      setVoices(response.passages);
      addShownThinkers(response.passages.map(p => p.thinker));
      showVoiceCards(response.passages);
    } catch (error) {
      setLoading(false);
      setError('Failed to find more wisdom. Please try again.');
    }
  };

  const handleNoneSelected = () => {
    // Add a follow-up message asking what kind of wisdom they're looking for
    addClarifyingQuestion(
      "I understand.",
      "What kind of wisdom are you looking for? Perhaps a different perspective or tradition?"
    );
    // Change stage back to awaiting_response so user can answer
    setStage('awaiting_response');
  };

  // Triple-tap for dev menu, also dismisses keyboard on tap
  const handleGreetingPress = () => {
    // Dismiss keyboard on any tap in the chat area
    Keyboard.dismiss();

    const now = Date.now();
    if (now - lastTapRef.current < 500) {
      tapCountRef.current += 1;
      if (tapCountRef.current >= 3) {
        setShowDevMenu(true);
        tapCountRef.current = 0;
      }
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will clear your name and show the welcome screen on next launch.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearOnboarding();
            setShowDevMenu(false);
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  const handleResetEverything = async () => {
    Alert.alert(
      'Reset Everything',
      'This will clear ALL data including auth, local storage, and flow tracking.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            await resetEverything();
            setShowDevMenu(false);
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  // Determine if input should be shown
  const showInput = state.stage === 'awaiting_input' || state.stage === 'awaiting_response' || state.stage === 'showing_voices' || state.stage === 'voice_selected' || state.stage === 'reflection_acknowledged';
  const showPromptChips = state.stage === 'awaiting_input' && !isKeyboardVisible;

  // Get placeholder text based on stage
  const getPlaceholder = (): string => {
    if (state.stage === 'awaiting_input') {
      return 'Share what\'s on your mind...';
    }
    if (state.stage === 'awaiting_response') {
      return 'Share your thoughts...';
    }
    if (state.stage === 'showing_voices') {
      return 'Ask about any card or share more context...';
    }
    if (state.stage === 'voice_selected') {
      return 'Add your reflections...';
    }
    if (state.stage === 'reflection_acknowledged') {
      return 'Continue reflecting or see another voice...';
    }
    return 'Type a message...';
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: FigmaColors.gradientTop,
        },
      ]}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={[FigmaColors.gradientTop, FigmaColors.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Signup Modal */}
      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
        mode="save"
      />

      {/* Dev Menu Modal */}
      <Modal
        visible={showDevMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDevMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDevMenu(false)}
        >
          <View
            style={[
              styles.devMenuContainer,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.devMenuTitle,
                {
                  color: colors.text,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              Dev Menu
            </Text>

            <Pressable
              onPress={handleResetOnboarding}
              style={({ pressed }) => [
                styles.devMenuItem,
                {
                  backgroundColor: pressed ? colors.backgroundInput : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.devMenuItemText,
                  {
                    color: colors.textSecondary,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Reset Onboarding
              </Text>
            </Pressable>

            <View style={[styles.devMenuDivider, { backgroundColor: colors.divider }]} />

            <Pressable
              onPress={handleResetEverything}
              style={({ pressed }) => [
                styles.devMenuItem,
                {
                  backgroundColor: pressed ? colors.backgroundInput : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.devMenuItemText,
                  {
                    color: '#ff4444',
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Reset Everything
              </Text>
            </Pressable>

            <View style={[styles.devMenuDivider, { backgroundColor: colors.divider }]} />

            <Pressable
              onPress={() => setShowDevMenu(false)}
              style={({ pressed }) => [
                styles.devMenuItem,
                {
                  backgroundColor: pressed ? colors.backgroundInput : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.devMenuItemText,
                  {
                    color: colors.textMuted,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Chat Messages */}
      <View style={styles.chatArea}>
        <ChatMessageList
          messages={state.messages}
          userName={userName}
          onSelectVoice={handleSelectVoice}
          onSeeAnother={handleSeeAnotherFromSameSet}
          onSave={handleSave}
          onSelectPrompt={handlePromptSelect}
          onNoneSelected={handleNoneSelected}
          onBackgroundPress={handleGreetingPress}
          showPromptChips={showPromptChips}
          isSaving={isSaving}
          isSaved={state.isSaved}
          bottomInset={showInput ? 80 : insets.bottom}
        />
      </View>

      {/* Input */}
      {showInput && (
        <View style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}>
          <ChatInput
            ref={chatInputRef}
            onSubmit={handleSubmit}
            placeholder={getPlaceholder()}
            disabled={state.stage !== 'awaiting_input' && state.stage !== 'awaiting_response' && state.stage !== 'showing_voices' && state.stage !== 'voice_selected' && state.stage !== 'reflection_acknowledged'}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  devMenuContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
  },
  devMenuTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  devMenuItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  devMenuItemText: {
    fontSize: Typography.body.fontSize,
    textAlign: 'center',
  },
  devMenuDivider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
});
