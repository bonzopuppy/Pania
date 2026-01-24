import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Passage } from '@/services/ai';
import { JournalEntry, ConversationData, ConversationMessage } from '@/services/journal';

// Chat message types
export type ChatMessage =
  | { type: 'greeting'; text: string; id: string }
  | { type: 'user_input'; text: string; id: string }
  | { type: 'clarifying_question'; text: string; acknowledgment?: string; id: string }
  | { type: 'user_response'; text: string; id: string }
  | { type: 'voices_intro'; text: string; id: string }
  | { type: 'voice_cards'; voices: Passage[]; id: string }
  | { type: 'selected_voice'; voice: Passage; expanded: boolean; id: string }
  | { type: 'loading'; text?: string; id: string }
  | { type: 'reflection_acknowledgment'; text: string; id: string };

export type ChatStage =
  | 'initial'
  | 'awaiting_input'
  | 'loading_clarify'
  | 'awaiting_response'
  | 'loading_voices'
  | 'showing_voices'
  | 'voice_selected'
  | 'generating_acknowledgment'
  | 'reflection_acknowledged';

export interface ChatState {
  messages: ChatMessage[];
  stage: ChatStage;
  selectedVoice: Passage | null;
  userInput: string;
  clarification: string;
  isSaved: boolean;
  error: string | null;
  shownThinkers: string[];  // Track thinker names shown in this session
  journalEntryId: string | null;  // Track the current journal entry being built
}

// Actions
type ChatAction =
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; id: string; updates: Partial<ChatMessage> }
  | { type: 'REMOVE_MESSAGE'; id: string }
  | { type: 'SET_STAGE'; stage: ChatStage }
  | { type: 'SET_USER_INPUT'; input: string }
  | { type: 'SET_CLARIFICATION'; clarification: string }
  | { type: 'SELECT_VOICE'; voice: Passage }
  | { type: 'EXPAND_VOICE'; expanded: boolean }
  | { type: 'SET_SAVED'; saved: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET_CHAT' }
  | { type: 'RESET_TO_VOICES' }
  | { type: 'ADD_SHOWN_THINKERS'; thinkers: string[] }
  | { type: 'PREPARE_FOR_MORE_VOICES' }
  | { type: 'SET_JOURNAL_ENTRY_ID'; id: string | null }
  | { type: 'RESTORE_FROM_ENTRY'; entry: JournalEntry };

// Initial state
const initialState: ChatState = {
  messages: [],
  stage: 'initial',
  selectedVoice: null,
  userInput: '',
  clarification: '',
  isSaved: false,
  error: null,
  shownThinkers: [],
  journalEntryId: null,
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id ? ({ ...msg, ...action.updates } as ChatMessage) : msg
        ),
      };

    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.id),
      };

    case 'SET_STAGE':
      return {
        ...state,
        stage: action.stage,
      };

    case 'SET_USER_INPUT':
      return {
        ...state,
        userInput: action.input,
      };

    case 'SET_CLARIFICATION':
      return {
        ...state,
        clarification: action.clarification,
      };

    case 'SELECT_VOICE':
      return {
        ...state,
        selectedVoice: action.voice,
        stage: 'voice_selected',
      };

    case 'EXPAND_VOICE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.type === 'selected_voice' ? { ...msg, expanded: action.expanded } : msg
        ),
      };

    case 'SET_SAVED':
      return {
        ...state,
        isSaved: action.saved,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };

    case 'RESET_CHAT':
      return {
        ...initialState,
        messages: [
          {
            type: 'greeting',
            text: getGreeting(),
            id: generateId(),
          },
        ],
        stage: 'awaiting_input',
      };

    case 'RESET_TO_VOICES':
      // Remove selected_voice message and go back to showing voice cards
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.type !== 'selected_voice'),
        selectedVoice: null,
        stage: 'showing_voices',
        isSaved: false,
      };

    case 'ADD_SHOWN_THINKERS':
      return {
        ...state,
        shownThinkers: [...state.shownThinkers, ...action.thinkers],
      };

    case 'PREPARE_FOR_MORE_VOICES':
      // Collapse the selected voice but keep it in chat history
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.type === 'selected_voice' ? { ...msg, expanded: false } : msg
        ),
        selectedVoice: null,
      };

    case 'SET_JOURNAL_ENTRY_ID':
      return {
        ...state,
        journalEntryId: action.id,
      };

    case 'RESTORE_FROM_ENTRY': {
      const entry = action.entry;
      const conversationData = entry.conversation_data as ConversationData | null;

      if (!conversationData) {
        // Can't restore without conversation data
        return state;
      }

      // Convert stored conversation messages back to ChatMessages
      const restoredMessages: ChatMessage[] = conversationData.messages.map((msg, index) => {
        const id = `restored-${index}-${Date.now()}`;
        switch (msg.type) {
          case 'greeting':
            return { type: 'greeting', text: msg.text, id };
          case 'user_input':
            return { type: 'user_input', text: msg.text, id };
          case 'clarifying_question':
            return { type: 'clarifying_question', text: msg.text, acknowledgment: msg.acknowledgment, id };
          case 'user_response':
            return { type: 'user_response', text: msg.text, id };
          case 'voices_intro':
            return { type: 'voices_intro', text: msg.text, id };
          case 'voice_cards':
            return { type: 'voice_cards', voices: msg.voices, id };
          case 'selected_voice':
            return { type: 'selected_voice', voice: msg.voice, expanded: true, id };
          case 'reflection_acknowledgment':
            return { type: 'reflection_acknowledgment', text: msg.text, id };
          default:
            return { type: 'greeting', text: '', id };
        }
      });

      return {
        ...state,
        messages: restoredMessages,
        stage: conversationData.stage as ChatStage,
        userInput: conversationData.userInput,
        clarification: conversationData.clarification,
        selectedVoice: conversationData.selectedVoice,
        shownThinkers: conversationData.shownThinkers || [],
        journalEntryId: entry.id,
        isSaved: false,
        error: null,
      };
    }

    default:
      return state;
  }
}

// Helper functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getGreeting(): string {
  return 'Hi';
}

// Context
interface ChatContextValue {
  state: ChatState;
  // Actions
  addGreeting: (userName?: string | null) => void;
  submitUserInput: (text: string) => void;
  addClarifyingQuestion: (acknowledgment: string, question: string) => void;
  submitUserResponse: (text: string) => void;
  submitReflection: (text: string) => void;
  addReflectionAcknowledgment: (text: string) => void;
  addVoicesIntro: (text: string) => void;
  showVoiceCards: (voices: Passage[]) => void;
  selectVoice: (voice: Passage) => void;
  expandVoice: (expanded: boolean) => void;
  seeAnotherVoice: () => void;
  prepareForMoreVoices: () => void;
  startOver: () => void;
  setLoading: (isLoading: boolean, text?: string) => void;
  setSaved: (saved: boolean) => void;
  setError: (error: string | null) => void;
  addShownThinkers: (thinkers: string[]) => void;
  // Stage helpers
  setStage: (stage: ChatStage) => void;
  // Journal entry tracking
  setJournalEntryId: (id: string | null) => void;
  restoreFromEntry: (entry: JournalEntry) => void;
  // Helper to get current conversation data for saving
  getConversationData: () => ConversationData;
}

const ChatContext = createContext<ChatContextValue | null>(null);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addGreeting = useCallback((userName?: string | null) => {
    const greeting = getGreeting();
    const text = userName ? `${greeting}, ${userName}` : greeting;
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'greeting', text, id: generateId() },
    });
    dispatch({ type: 'SET_STAGE', stage: 'awaiting_input' });
  }, []);

  const submitUserInput = useCallback((text: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'user_input', text, id: generateId() },
    });
    dispatch({ type: 'SET_USER_INPUT', input: text });
    dispatch({ type: 'SET_STAGE', stage: 'loading_clarify' });
  }, []);

  const addClarifyingQuestion = useCallback((acknowledgment: string, question: string) => {
    // Remove loading message if present
    dispatch({ type: 'SET_STAGE', stage: 'awaiting_response' });
    dispatch({
      type: 'ADD_MESSAGE',
      message: {
        type: 'clarifying_question',
        text: question,
        acknowledgment,
        id: generateId(),
      },
    });
  }, []);

  const submitUserResponse = useCallback((text: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'user_response', text, id: generateId() },
    });
    dispatch({ type: 'SET_CLARIFICATION', clarification: text });
    dispatch({ type: 'SET_STAGE', stage: 'loading_voices' });
  }, []);

  const submitReflection = useCallback((text: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'user_response', text, id: generateId() },
    });
    // Store reflection in clarification field
    dispatch({ type: 'SET_CLARIFICATION', clarification: text });
    dispatch({ type: 'SET_STAGE', stage: 'generating_acknowledgment' });
  }, []);

  const addReflectionAcknowledgment = useCallback((text: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'reflection_acknowledgment', text, id: generateId() },
    });
    dispatch({ type: 'SET_STAGE', stage: 'reflection_acknowledged' });
  }, []);

  const addVoicesIntro = useCallback((text: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'voices_intro', text, id: generateId() },
    });
  }, []);

  const showVoiceCards = useCallback((voices: Passage[]) => {
    dispatch({ type: 'SET_STAGE', stage: 'showing_voices' });
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'voice_cards', voices, id: generateId() },
    });
  }, []);

  const selectVoice = useCallback((voice: Passage) => {
    // Remove voice_cards message and add selected_voice
    const voiceCardsId = state.messages.find((m) => m.type === 'voice_cards')?.id;
    if (voiceCardsId) {
      dispatch({ type: 'REMOVE_MESSAGE', id: voiceCardsId });
    }
    dispatch({ type: 'SELECT_VOICE', voice });
    dispatch({
      type: 'ADD_MESSAGE',
      message: { type: 'selected_voice', voice, expanded: true, id: generateId() },
    });
  }, [state.messages]);

  const expandVoice = useCallback((expanded: boolean) => {
    dispatch({ type: 'EXPAND_VOICE', expanded });
  }, []);

  const seeAnotherVoice = useCallback(() => {
    dispatch({ type: 'RESET_TO_VOICES' });
    // Re-add the voice cards
    const voiceCardsMsg = state.messages.find((m) => m.type === 'selected_voice');
    if (voiceCardsMsg && voiceCardsMsg.type === 'selected_voice') {
      // We need to get the original voices - they should be stored somewhere
      // For now, this will be handled by the parent component
    }
  }, [state.messages]);

  const prepareForMoreVoices = useCallback(() => {
    dispatch({ type: 'PREPARE_FOR_MORE_VOICES' });
  }, []);

  const startOver = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, []);

  const setLoading = useCallback((isLoading: boolean, text?: string) => {
    if (isLoading) {
      dispatch({
        type: 'ADD_MESSAGE',
        message: { type: 'loading', text, id: 'loading' },
      });
    } else {
      dispatch({ type: 'REMOVE_MESSAGE', id: 'loading' });
    }
  }, []);

  const setSaved = useCallback((saved: boolean) => {
    dispatch({ type: 'SET_SAVED', saved });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  const addShownThinkers = useCallback((thinkers: string[]) => {
    dispatch({ type: 'ADD_SHOWN_THINKERS', thinkers });
  }, []);

  const setStage = useCallback((stage: ChatStage) => {
    dispatch({ type: 'SET_STAGE', stage });
  }, []);

  const setJournalEntryId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_JOURNAL_ENTRY_ID', id });
  }, []);

  const restoreFromEntry = useCallback((entry: JournalEntry) => {
    dispatch({ type: 'RESTORE_FROM_ENTRY', entry });
  }, []);

  // Helper to build conversation data for saving
  const getConversationData = useCallback((): ConversationData => {
    // Convert ChatMessages to ConversationMessages (strip internal IDs, add timestamps)
    const messages: ConversationMessage[] = state.messages
      .filter(msg => msg.type !== 'loading') // Exclude loading messages
      .map(msg => {
        const timestamp = new Date().toISOString();
        switch (msg.type) {
          case 'greeting':
            return { type: 'greeting', text: msg.text, timestamp };
          case 'user_input':
            return { type: 'user_input', text: msg.text, timestamp };
          case 'clarifying_question':
            return { type: 'clarifying_question', text: msg.text, acknowledgment: msg.acknowledgment, timestamp };
          case 'user_response':
            return { type: 'user_response', text: msg.text, timestamp };
          case 'voices_intro':
            return { type: 'voices_intro', text: msg.text, timestamp };
          case 'voice_cards':
            return { type: 'voice_cards', voices: msg.voices, timestamp };
          case 'selected_voice':
            return { type: 'selected_voice', voice: msg.voice, timestamp };
          case 'reflection_acknowledgment':
            return { type: 'reflection_acknowledgment', text: msg.text, timestamp };
          default:
            return { type: 'greeting', text: '', timestamp };
        }
      });

    return {
      messages,
      stage: state.stage,
      userInput: state.userInput,
      clarification: state.clarification,
      selectedVoice: state.selectedVoice,
      shownThinkers: state.shownThinkers,
      savedAt: new Date().toISOString(),
      isComplete: state.selectedVoice !== null,
    };
  }, [state]);

  const value: ChatContextValue = {
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
    expandVoice,
    seeAnotherVoice,
    prepareForMoreVoices,
    startOver,
    setLoading,
    setSaved,
    setError,
    addShownThinkers,
    setStage,
    setJournalEntryId,
    restoreFromEntry,
    getConversationData,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export { generateId, getGreeting };
