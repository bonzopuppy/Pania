import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Colors, Fonts, Typography, Spacing, BorderRadius, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Passage } from '@/services/ai';
import MiniPattern from '@/assets/images/patterns/mini-pattern.svg';

type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

const FigmaColors = {
  text: '#282621',
  textSecondary: '#282520',
};

// Helper to convert hex to rgba for gradient
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ExpandedVoiceProps {
  voice: Passage;
  onSeeAnother: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export default function ExpandedVoice({
  voice,
  onSeeAnother,
  onSave,
  isSaving = false,
  isSaved = false,
}: ExpandedVoiceProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;
  const captureCardRef = useRef<View>(null);

  const traditionColors = Palette.traditions[voice.tradition as Tradition] || Palette.traditions.stoicism;

  const handleShare = useCallback(async () => {
    try {
      const uri = await captureRef(captureCardRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Shared from Pania',
      });
    } catch {
      // User cancelled or share failed
    }
  }, [voice]);

  // Shared card content renderer (used by both display and capture)
  const renderCardContent = (showBranding = false) => (
    <>
      {/* Background with gradient */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[styles.backgroundBase, { backgroundColor: '#FFFFFF' }]} />
        <LinearGradient
          colors={[hexToRgba(traditionColors.primary, 0.4), 'rgba(255, 255, 255, 0)']}
          style={styles.gradientOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.325 }}
        />
      </View>

      {/* Mini-pattern icon in top right */}
      <View style={styles.iconContainer}>
        <MiniPattern width={16} height={16} color={traditionColors.primary} />
      </View>

      <View style={styles.content}>
        {/* Thinker name */}
        <Text
          style={[
            styles.thinkerName,
            {
              color: FigmaColors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {voice.thinker}
        </Text>

        {/* Thinker role */}
        <Text
          style={[
            styles.thinkerInfo,
            {
              color: FigmaColors.textSecondary,
              fontFamily: fonts?.sansMedium,
            },
          ]}
        >
          {voice.role}
        </Text>

        {/* Quote */}
        <Text
          style={[
            styles.quoteText,
            {
              color: FigmaColors.textSecondary,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          {voice.text}
        </Text>

        {/* Source */}
        {voice.source && (
          <Text
            style={[
              styles.sourceText,
              {
                color: FigmaColors.textSecondary,
                fontFamily: fonts?.sansMedium,
              },
            ]}
          >
            – {voice.source}
          </Text>
        )}

        {/* Context */}
        <Text
          style={[
            styles.contextText,
            {
              color: FigmaColors.textSecondary,
              fontFamily: fonts?.sansMedium,
            },
          ]}
        >
          {voice.context || 'This wisdom has been shared across generations.'}
        </Text>
      </View>

      {showBranding && (
        <View style={styles.brandingFooter}>
          <View style={styles.brandingDivider} />
          <View style={styles.brandingRow}>
            <Text
              style={[
                styles.brandingText,
                { fontFamily: fonts?.serif },
              ]}
            >
              Shared on{' '}
              <Text style={{ color: 'rgba(40, 38, 33, 0.55)' }}>Pania</Text>
            </Text>
            <Text
              style={[
                styles.brandingUrl,
                { fontFamily: fonts?.sansMedium },
              ]}
            >
              pania.world
            </Text>
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Hidden off-screen card for capture (no buttons) */}
      <View style={styles.captureWrapper} pointerEvents="none">
        <View ref={captureCardRef} collapsable={false} style={styles.captureCard}>
          {renderCardContent(true)}
        </View>
      </View>

      {/* Visible card with buttons */}
      <View style={styles.card}>
        {renderCardContent()}

        <View style={styles.buttonsArea}>
          {/* See another voice button */}
          <Pressable
            onPress={onSeeAnother}
            style={({ pressed }) => [
              styles.pillButton,
              pressed && styles.pillButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.pillButtonText,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              See another voice
            </Text>
          </Pressable>

          {/* Share button */}
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.pillButton,
              styles.shareButton,
              pressed && styles.pillButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.pillButtonText,
                {
                  color: FigmaColors.text,
                  fontFamily: fonts?.sansSemiBold,
                },
              ]}
            >
              Share
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  // Off-screen capture card
  captureWrapper: {
    position: 'absolute',
    left: -9999,
    opacity: 0,
  },
  captureCard: {
    width: 361,
    borderRadius: 24,
    overflow: 'hidden',
  },
  // Visible card
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  iconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    padding: 24,
  },
  buttonsArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  thinkerName: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
    paddingRight: 32,
  },
  thinkerInfo: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.6,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 21.6,
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.6,
    marginBottom: 24,
  },
  contextText: {
    fontSize: 16,
    lineHeight: 21.6,
    marginBottom: 0,
  },
  brandingFooter: {
    paddingBottom: 16,
  },
  brandingDivider: {
    height: 1,
    backgroundColor: 'rgba(40, 38, 33, 0.1)',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  brandingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  brandingText: {
    fontSize: 14,
    color: 'rgba(40, 38, 33, 0.4)',
  },
  brandingUrl: {
    fontSize: 14,
    color: 'rgba(40, 38, 33, 0.4)',
  },
  pillButton: {
    height: 40,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: FigmaColors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    marginTop: 8,
  },
  pillButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  pillButtonText: {
    fontSize: 14,
    lineHeight: 18.9,
  },
});
