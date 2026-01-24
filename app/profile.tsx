import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Fonts, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserName, getUserId, clearOnboarding } from '@/services/storage';
import { signOut } from '@/services/auth';
import { getJournalEntries, JournalEntry } from '@/services/journal';
import SignupModal from '@/components/SignupModal';
import { VoicesSection } from '@/components/profile';

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const loadProfile = async () => {
    const name = await getUserName();
    const userId = await getUserId();
    setUserName(name);
    setIsLoggedIn(!!userId);

    // Load journal entries for voices section
    if (userId) {
      try {
        const { entries: journalEntries, error } = await getJournalEntries();
        if (!error && journalEntries) {
          setEntries(journalEntries);
        }
      } catch (e) {
        console.error('Failed to load journal entries:', e);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleBack = () => {
    router.back();
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    loadProfile();
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  const handleChangeName = async () => {
    Alert.alert(
      'Change Name',
      'This will take you through the welcome flow again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            await clearOnboarding();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
        mode="profile"
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          Profile
        </Text>

        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Name
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {userName || 'Not set'}
          </Text>
        </View>

        {/* Account Status */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: colors.textMuted,
                fontFamily: fonts?.sans,
              },
            ]}
          >
            Account
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: colors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            {isLoggedIn ? 'Signed in' : 'Guest'}
          </Text>
        </View>

        {/* Voices Section */}
        {isLoggedIn && entries.length > 0 && (
          <VoicesSection entries={entries} />
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={handleChangeName}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.backgroundInput,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts?.sans,
                },
              ]}
            >
              Change name
            </Text>
          </Pressable>

          {isLoggedIn ? (
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.backgroundInput,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: '#ff4444',
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Sign out
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setShowSignupModal(true)}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.buttonPrimary,
                  borderColor: colors.buttonPrimary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: colors.buttonText,
                    fontFamily: fonts?.sans,
                  },
                ]}
              >
                Sign up / Sign in
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerButton: {
    padding: Spacing.xs,
    width: 40,
  },
  title: {
    fontSize: Typography.question.fontSize,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.body.fontSize,
  },
  actionsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '500',
  },
});
