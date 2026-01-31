import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import SendIcon from '@/assets/images/icons/send.svg';

const INPUT_ACCESSORY_ID = 'chat-input-accessory';

// Figma design colors
const FigmaColors = {
  inputBackground: 'rgba(40, 38, 33, 0.48)',
  inputText: '#FFFFFF',
  inputPlaceholder: 'rgba(255, 255, 255, 0.6)',
  sendButtonActive: '#FFFFFF',
  sendButtonInactive: 'rgba(255, 255, 255, 0.4)',
};

interface ChatInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export interface ChatInputRef {
  setText: (text: string) => void;
  focus: () => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(function ChatInput({
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  autoFocus = false,
}, ref) {
  const [text, setTextState] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const mainInputRef = useRef<TextInput>(null);
  const accessoryInputRef = useRef<TextInput>(null);
  const pendingFocusRef = useRef(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  // Track keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
      // If we have a pending focus request, focus the accessory input now
      if (pendingFocusRef.current && Platform.OS === 'ios') {
        setTimeout(() => {
          accessoryInputRef.current?.focus();
          pendingFocusRef.current = false;
        }, 50);
      }
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    setText: (newText: string) => {
      setTextState(newText);
      // Mark that we want to focus after keyboard appears
      pendingFocusRef.current = true;
      // Focus the main input to bring up keyboard
      setTimeout(() => {
        mainInputRef.current?.focus();
      }, 100);
    },
    focus: () => {
      mainInputRef.current?.focus();
    },
  }));

  const handleSubmit = () => {
    if (text.trim() && !disabled) {
      onSubmit(text.trim());
      setTextState('');
      Keyboard.dismiss();
    }
  };

  const isSubmitDisabled = !text.trim() || disabled;

  const renderInput = (inputRefToUse: React.RefObject<TextInput>) => (
    <View style={styles.inputWrapper}>
      <TextInput
        ref={inputRefToUse}
        value={text}
        onChangeText={setTextState}
        placeholder={placeholder}
        placeholderTextColor={FigmaColors.inputPlaceholder}
        style={[
          styles.textInput,
          {
            color: FigmaColors.inputText,
            fontFamily: fonts?.sans,
          },
        ]}
        maxLength={1000}
        editable={!disabled}
        autoFocus={autoFocus}
        multiline
        cursorColor={FigmaColors.inputText}
        selectionColor={FigmaColors.inputPlaceholder}
        inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
        style={({ pressed }) => [
          styles.sendButton,
          {
            backgroundColor: FigmaColors.sendButtonActive,
            opacity: isSubmitDisabled ? 0.4 : pressed ? 0.8 : 1,
          },
        ]}
      >
        <SendIcon width={20} height={20} />
      </Pressable>
    </View>
  );

  return (
    <>
      <View style={styles.container}>{renderInput(mainInputRef)}</View>

      {/* iOS Keyboard Accessory */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
          <View style={styles.accessoryContainer}>
            {renderInput(accessoryInputRef)}
          </View>
        </InputAccessoryView>
      )}
    </>
  );
});

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: FigmaColors.inputBackground,
    borderRadius: 24,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    minHeight: 24,
    maxHeight: 96,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  accessoryContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
});
