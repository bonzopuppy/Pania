import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatContainer } from '@/components/chat';
import JournalsButton from '@/components/JournalsButton';

export default function ChatScreen() {
  const { restore } = useLocalSearchParams<{ restore?: string }>();

  const handleOpenJournals = () => {
    router.push('/journals');
  };

  return (
    <ChatProvider>
      <View style={styles.container}>
        <ChatContainer onOpenJournals={handleOpenJournals} restoreEntryId={restore} />
        <JournalsButton onPress={handleOpenJournals} />
      </View>
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
