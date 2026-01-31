import React from 'react';
import { View, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Passage } from '@/services/ai';
import VoiceCard from './VoiceCard';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

// Special item type for "None of these" card
type ListItem = Passage | { type: 'none_selected' };

interface VoiceCardsRowProps {
  voices: Passage[];
  onSelectVoice: (voice: Passage) => void;
  onNoneSelected?: () => void;
  selectedVoiceId?: string;
}

export default function VoiceCardsRow({
  voices,
  onSelectVoice,
  onNoneSelected,
  selectedVoiceId,
}: VoiceCardsRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  // Append "None of these" item to the list
  const listData: ListItem[] = [...voices, { type: 'none_selected' }];

  // Calculate snap offsets for each card
  // First card snaps at 0, subsequent cards at (CARD_WIDTH + CARD_MARGIN) intervals
  const CARD_WIDTH = 329;
  const CARD_MARGIN = Spacing.md;
  const snapOffsets = listData.map((_, index) => index * (CARD_WIDTH + CARD_MARGIN));

  const renderItem = ({ item }: { item: ListItem }) => {
    // Render "None of these speak to me" card
    if ('type' in item && item.type === 'none_selected') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.noneCard,
            pressed && styles.noneCardPressed,
          ]}
          onPress={onNoneSelected}
        >
          <Text
            style={[
              styles.noneCardText,
              { fontFamily: fonts?.sans },
            ]}
          >
            None of these speak to me
          </Text>
        </Pressable>
      );
    }

    // Render regular voice card
    return (
      <VoiceCard
        voice={item}
        onSelect={onSelectVoice}
        isSelected={item.id === selectedVoiceId}
        compact
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <MiniPattern width={24} height={24} />
        <Text
          style={[
            styles.heading,
            {
              color: '#282621',
              fontFamily: fonts?.sans,
            },
          ]}
        >
          Which of these speaks to you?
        </Text>
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => 'type' in item ? 'none_selected' : item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToOffsets={snapOffsets}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  heading: {
    fontSize: Typography.body.fontSize,
  },
  listContent: {
    paddingLeft: Spacing.md,
    paddingRight: 64, // Extra padding so last card has room to scroll
  },
  noneCard: {
    width: 329,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D2CD',
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  noneCardPressed: {
    backgroundColor: '#F5F5F3',
  },
  noneCardText: {
    fontSize: Typography.body.fontSize,
    color: '#7A7670',
    textAlign: 'center',
  },
});
