/**
 * GBICH'APP — Design Tokens & Theme Constants.
 *
 * Dérivés de la charte graphique officielle et du skill gbich-ui-ux-pro-max.
 */

export const GBICH_COLORS = {
  // 1. Couleurs Maîtresses
  primary: '#F5222D',       // Satirical Red
  secondary: '#171416',     // Ink Charcoal
  tertiary: '#A80F1C',      // Crimson Bordeaux
  neutral: '#E8E5E2',       // Warm Newsprint

  // 2. Déclinaisons Utilitaires
  primaryHover: '#FF4D4F',
  primaryDark: '#730E18',
  primarySubtle: '#FFF1F0',

  charcoalDark: '#0D0C0D',
  charcoalCard: '#262325',
  charcoalBorder: '#3D393B',
  charcoalTextMuted: '#969093',

  newsprintLight: '#FAF9F8',
  newsprintCard: '#F3F1EF',
  newsprintBorder: '#D4D0CC',

  // 3. Sémantiques & EMI
  verdictVrai: '#10B981',
  verdictFaux: '#F5222D',
  verdictTrompeur: '#F59E0B',
  verdictHorsContexte: '#8B5CF6',
  white: '#FFFFFF',
} as const;

export const GBICH_FONTS = {
  headline: 'Anton',
  body: 'Inter',
  label: 'Space Grotesk',
} as const;

export const GBICH_RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const;

export const GBICH_SHADOWS = {
  subtle: {
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryGlow: {
    shadowColor: '#F5222D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;
