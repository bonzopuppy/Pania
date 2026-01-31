import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '@/constants/theme';
import MenuIcon from '@/assets/images/icons/menu-icon.svg';

interface JournalsButtonProps {
  onPress: () => void;
}

export default function JournalsButton({ onPress }: JournalsButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + Spacing.sm,
          right: Spacing.md + 10,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <MenuIcon width={24} height={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
