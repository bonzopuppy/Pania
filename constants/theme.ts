/**
 * Pania Design System
 * A warm, serene color palette inspired by journal aesthetics
 */

// Pania Design System fonts and theme

// Core Pania palette
export const Palette = {
  // Backgrounds
  backgroundOuter: '#F3EDE7',    // Outer/page background
  backgroundCard: '#FAF7F3',     // Card/container background
  backgroundInput: '#FFFDFA',    // Input/interactive elements

  // Text
  textPrimary: '#3D3730',        // Primary text (headings, quotes)
  textSecondary: '#5C554C',      // Secondary text (subheadings, body)
  textMuted: '#9A948C',          // Muted text (hints, timestamps)
  textSubtle: '#A9A299',         // Very subtle text (helper text)

  // Borders & Dividers
  border: '#E6DFD7',             // Card borders
  divider: '#E0D9D0',            // Dividers

  // Primary action
  buttonPrimary: '#6B635A',      // Primary button background
  buttonText: '#FAF7F3',         // Button text

  // Tradition colors (for wisdom cards)
  traditions: {
    stoicism: {
      primary: '#5B7C8D',
      light: '#EEF3F5',
    },
    christianity: {
      primary: '#8B5A5A',
      light: '#F5EFEF',
    },
    buddhism: {
      primary: '#B8860B',
      light: '#F9F5EB',
    },
    sufism: {
      primary: '#8B6B8B',
      light: '#F5EFF5',
    },
    taoism: {
      primary: '#5A7C5A',
      light: '#EFF5EF',
    },
    judaism: {
      primary: '#6B6B8B',
      light: '#EFEFF5',
    },
  },
};

export const Colors = {
  light: {
    text: Palette.textPrimary,
    textSecondary: Palette.textSecondary,
    textMuted: Palette.textMuted,
    background: Palette.backgroundOuter,
    backgroundCard: Palette.backgroundCard,
    backgroundInput: Palette.backgroundInput,
    border: Palette.border,
    divider: Palette.divider,
    tint: Palette.buttonPrimary,
    buttonPrimary: Palette.buttonPrimary,
    buttonText: Palette.buttonText,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.buttonPrimary,
  },
  dark: {
    // Dark mode uses inverted/adjusted values
    text: '#ECEDEE',
    textSecondary: '#C4C4C4',
    textMuted: '#8A8A8A',
    background: '#1A1816',
    backgroundCard: '#252320',
    backgroundInput: '#2E2B28',
    border: '#3D3A36',
    divider: '#3D3A36',
    tint: '#D4CEC4',
    buttonPrimary: '#D4CEC4',
    buttonText: '#1A1816',
    icon: '#8A8A8A',
    tabIconDefault: '#8A8A8A',
    tabIconSelected: '#D4CEC4',
  },
};

export const Fonts = {
  // Gambarino - serif font for headings and titles
  serif: 'Gambarino-Regular',
  // Figtree - sans-serif font for body text
  sans: 'Figtree_400Regular',
  sansMedium: 'Figtree_500Medium',
  sansSemiBold: 'Figtree_600SemiBold',
  sansBold: 'Figtree_700Bold',
  // Aliases for compatibility
  rounded: 'Figtree_400Regular',
  mono: 'Figtree_400Regular', // Using Figtree as fallback for mono
};

export const Typography = {
  greeting: {
    fontSize: 30,
    lineHeight: 38,
  },
  question: {
    fontSize: 22,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
