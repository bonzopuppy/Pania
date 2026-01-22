import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Typography, Spacing } from '@/constants/theme';

// SVG imports
import CloseIcon from '@/assets/images/close_icon.svg';

// Figma design colors - cream/tan gradient
const FigmaColors = {
  gradientTop: '#F5EDD8',
  gradientBottom: '#EDE1D1',
  text: '#282621',
};

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[FigmaColors.gradientTop, FigmaColors.gradientBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Close Button */}
      <Pressable
        onPress={handleClose}
        style={[styles.closeButton, { top: insets.top + Spacing.md }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {({ pressed }) => (
          <View style={[styles.closeButtonCircle, { opacity: pressed ? 0.7 : 1 }]}>
            <CloseIcon
              width={12}
              height={12}
              stroke={FigmaColors.text}
            />
          </View>
        )}
      </Pressable>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { fontFamily: Fonts.sansSemiBold }]}>
            Terms of Service
          </Text>

          {/* Last Updated */}
          <Text style={[styles.lastUpdated, { fontFamily: Fonts.sansSemiBold }]}>
            Last Updated: January 21, 2026
          </Text>

          {/* Body Text */}
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            Welcome to Pania. These Terms of Service ("Terms") govern your access to and use of the Pania mobile application, website, and related services ("Services"). By using Pania, you agree to these Terms.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            By accessing or using Pania, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            2. Description of Services
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            Pania provides personalized wisdom and reflections drawn from various spiritual and philosophical traditions. Our Services are intended for personal growth and reflection purposes only.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            3. User Accounts
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            4. Privacy
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            5. Content and Intellectual Property
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            All content provided through Pania, including text, graphics, and other materials, is owned by or licensed to us and is protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            6. Disclaimer
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            Pania is not a substitute for professional advice. The wisdom and reflections provided are for personal enrichment only and should not be relied upon for medical, legal, financial, or other professional guidance.
          </Text>

          <Text style={[styles.sectionTitle, { fontFamily: Fonts.sansSemiBold }]}>
            7. Contact Us
          </Text>
          <Text style={[styles.bodyText, { fontFamily: Fonts.sans }]}>
            If you have any questions about these Terms, please contact us at support@pania.app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.xl,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 20,
    lineHeight: 27,
    color: FigmaColors.text,
    marginBottom: Spacing.lg,
  },
  lastUpdated: {
    fontSize: 14,
    lineHeight: 19,
    color: FigmaColors.text,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 19,
    color: FigmaColors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 19,
    color: FigmaColors.text,
  },
});
