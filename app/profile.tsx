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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import { Fonts, Spacing } from '@/constants/theme';
import { getUserName, getUserId } from '@/services/storage';
import { signOut, deleteAccount } from '@/services/auth';
import { getJournalEntries, JournalEntry } from '@/services/journal';
import SignupModal from '@/components/SignupModal';
import { VoicesSection } from '@/components/profile';

// Profile-specific colors from Figma
const ProfileColors = {
  backgroundGradient: {
    top: '#66BAB7',
    bottom: '#A5DEE4',
  },
  cardGradient: {
    top: 'rgba(255, 255, 255, 0.88)',
    bottom: 'rgba(255, 255, 255, 0.64)',
  },
  text: '#282621',
  inputDark: 'rgba(40, 38, 33, 0.48)',
  inputLight: 'rgba(40, 38, 33, 0.08)',
  inputWhite: 'rgba(255, 255, 255, 0.72)',
};

// Close button icon component
function CloseIcon({ color = '#282621' }: { color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12 4L4 12M4 4L12 12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const insets = useSafeAreaInsets();
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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteAccount();
            if (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } else {
              router.replace('/welcome');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[ProfileColors.backgroundGradient.top, ProfileColors.backgroundGradient.bottom]}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
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
        <Text
          style={[
            styles.title,
            {
              color: ProfileColors.text,
              fontFamily: fonts?.serif,
            },
          ]}
        >
          My Profile
        </Text>

        {/* Close Button */}
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.closeButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <LinearGradient
            colors={[ProfileColors.cardGradient.top, ProfileColors.cardGradient.bottom]}
            style={styles.closeButtonGradient}
          >
            <CloseIcon color={ProfileColors.text} />
          </LinearGradient>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Voices Section */}
        {entries.length > 0 && (
          <VoicesSection entries={entries} />
        )}

        {/* Personal Information Section */}
        <LinearGradient
          colors={[ProfileColors.cardGradient.top, ProfileColors.cardGradient.bottom]}
          style={styles.card}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: ProfileColors.text,
                fontFamily: fonts?.serif,
              },
            ]}
          >
            Personal Information
          </Text>

          {/* Name field */}
          <View style={styles.fieldContainer}>
            <Text
              style={[
                styles.fieldLabel,
                {
                  color: ProfileColors.text,
                  fontFamily: fonts?.sansMedium,
                },
              ]}
            >
              Name
            </Text>
            <View style={[styles.inputField, styles.inputFieldDark]}>
              <Text
                style={[
                  styles.inputText,
                  styles.inputTextLight,
                  { fontFamily: fonts?.sansMedium },
                ]}
              >
                {userName || 'Not set'}
              </Text>
            </View>
          </View>

          {/* Sign up/Login or Sign out button */}
          {isLoggedIn ? (
            <>
              <Pressable
                onPress={handleSignOut}
                style={({ pressed }) => [
                  styles.inputField,
                  styles.inputFieldWhite,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: ProfileColors.text,
                      fontFamily: fonts?.sansSemiBold,
                    },
                  ]}
                >
                  Sign out
                </Text>
              </Pressable>

              {/* Delete Account */}
              <Pressable
                onPress={handleDeleteAccount}
                style={({ pressed }) => [
                  styles.deleteAccountButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text
                  style={[
                    styles.deleteAccountText,
                    { fontFamily: fonts?.sansMedium },
                  ]}
                >
                  Delete Account
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => setShowSignupModal(true)}
              style={({ pressed }) => [
                styles.inputField,
                styles.inputFieldWhite,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: ProfileColors.text,
                    fontFamily: fonts?.sansSemiBold,
                  },
                ]}
              >
                Sign up/Login
              </Text>
            </Pressable>
          )}
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 25,
    marginBottom: Spacing.lg,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 17.5,
    marginBottom: Spacing.sm,
  },
  inputField: {
    height: 48,
    borderRadius: 64,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  inputFieldDark: {
    backgroundColor: ProfileColors.inputDark,
  },
  inputFieldLight: {
    backgroundColor: ProfileColors.inputLight,
  },
  inputFieldWhite: {
    backgroundColor: ProfileColors.inputWhite,
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    lineHeight: 21.6,
  },
  inputTextLight: {
    color: '#FFFFFF',
  },
  inputTextDark: {
    color: ProfileColors.text,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21.6,
    textAlign: 'center',
  },
  deleteAccountButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  deleteAccountText: {
    fontSize: 14,
    lineHeight: 17.5,
    color: '#D63B2B',
    textDecorationLine: 'underline',
  },
});
