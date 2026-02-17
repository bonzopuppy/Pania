import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Spacing } from '@/constants/theme';

export default function SkeletonVoiceCard() {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const placeholderColor = 'rgba(40, 38, 33, 0.08)';

  return (
    <View style={styles.card}>
      {/* Thinker name placeholder */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.namePlaceholder,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />

      {/* Role placeholder */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.rolePlaceholder,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />

      {/* Quote line 1 */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.quoteLine1,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />

      {/* Quote line 2 */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.quoteLine2,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />

      {/* Quote line 3 */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.quoteLine3,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />

      {/* Source placeholder */}
      <Animated.View
        style={[
          styles.placeholder,
          styles.sourcePlaceholder,
          { backgroundColor: placeholderColor, opacity: pulseAnim },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 329,
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginRight: Spacing.md,
    // Match VoiceCard shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  placeholder: {
    borderRadius: 6,
  },
  namePlaceholder: {
    width: 180,
    height: 32,
    marginBottom: 8,
  },
  rolePlaceholder: {
    width: 100,
    height: 12,
    marginBottom: 16,
  },
  quoteLine1: {
    width: 280,
    height: 16,
    marginBottom: 8,
  },
  quoteLine2: {
    width: 260,
    height: 16,
    marginBottom: 8,
  },
  quoteLine3: {
    width: 160,
    height: 16,
    marginBottom: 16,
  },
  sourcePlaceholder: {
    width: 120,
    height: 12,
  },
});
