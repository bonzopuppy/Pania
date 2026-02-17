import React, { useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Passage } from '@/services/ai';
import VoiceCard from './VoiceCard';
import SkeletonVoiceCard from './SkeletonVoiceCard';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

// Special item type for "None of these" card
type ListItem = Passage | { type: 'none_selected' };

interface VoiceCardsRowProps {
  voices?: Passage[];
  onSelectVoice?: (voice: Passage) => void;
  onNoneSelected?: () => void;
  selectedVoiceId?: string;
  skeleton?: boolean;
}

const SKELETON_DATA = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }];

export default function VoiceCardsRow({
  voices = [],
  onSelectVoice,
  onNoneSelected,
  selectedVoiceId,
  skeleton = false,
}: VoiceCardsRowProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  // Staggered animation values — one per card + 1 for "None of these"
  const itemCount = voices.length + 1;
  const animValues = useRef<Animated.Value[]>([]);

  // Ensure we have enough animated values
  if (animValues.current.length < itemCount && !skeleton) {
    animValues.current = Array.from({ length: itemCount }, () => new Animated.Value(0));
  }

  useEffect(() => {
    if (skeleton || voices.length === 0) return;

    // Reset all values to 0
    animValues.current.forEach((v) => v.setValue(0));

    // Stagger animations: 150ms apart, 300ms each
    const animations = animValues.current.map((v) =>
      Animated.timing(v, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.stagger(150, animations).start();
  }, [skeleton, voices]);

  if (skeleton) {
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
          data={SKELETON_DATA}
          renderItem={() => <SkeletonVoiceCard />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      </View>
    );
  }

  // Append "None of these" item to the list
  const listData: ListItem[] = [...voices, { type: 'none_selected' }];

  // Calculate snap offsets for each card
  const CARD_WIDTH = 329;
  const CARD_MARGIN = Spacing.md;
  const snapOffsets = listData.map((_, index) => index * (CARD_WIDTH + CARD_MARGIN));

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    const animValue = animValues.current[index] || new Animated.Value(1);

    const animatedStyle = {
      opacity: animValue,
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [12, 0],
          }),
        },
      ],
    };

    // Render "None of these speak to me" card
    if ('type' in item && item.type === 'none_selected') {
      return (
        <Animated.View style={animatedStyle}>
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
        </Animated.View>
      );
    }

    // Render regular voice card
    const voice = item as Passage;
    return (
      <Animated.View style={animatedStyle}>
        <VoiceCard
          voice={voice}
          onSelect={onSelectVoice!}
          isSelected={voice.id === selectedVoiceId}
          compact
        />
      </Animated.View>
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
