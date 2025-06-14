// Color system for the Laurentian Banking app
// Primary palette - professional blues with gold accent
export const PRIMARY = {
  MAIN: '#003E6D', // Main brand blue - darker, more professional navy blue
  LIGHT: '#E5EFF5', // Light blue for backgrounds - softer to match navy theme
  DARK: '#002E51', // Darker navy for emphasis
};

// Secondary/accent palette - refined gold tones to replace bright yellows
export const ACCENT = {
  MAIN: '#F2C94C', // Gold accent - more refined than bright yellow
  LIGHT: '#FFF8E1', // Very light gold for backgrounds - replaces LIGHT_YELLOW
  DARK: '#E5B93D', // Darker gold for emphasis
};

// Semantic colors for feedback
export const SEMANTIC = {
  SUCCESS: '#2ECC71', // Green for success messages
  WARNING: '#F39C12', // Orange for warnings
  ERROR: '#E74C3C',   // Red for errors
  INFO: '#3498DB',    // Blue for information
};

// Neutral colors for text, backgrounds, etc.
export const NEUTRAL = {
  WHITE: '#FFFFFF',
  GRAY_100: '#F7F9FC', // Lightest gray - for backgrounds
  GRAY_200: '#EDF2F7', // Light gray - for disabled elements, dividers
  GRAY_300: '#E2E8F0', // For borders
  GRAY_400: '#CBD5E0', // For disabled text
  GRAY_500: '#A0AEC0', // For placeholder text
  GRAY_600: '#718096', // For secondary text
  GRAY_700: '#4A5568', // For primary text
  GRAY_800: '#2D3748', // For headings
  GRAY_900: '#1A202C', // Darkest - for emphasis
  BLACK: '#000000',
};

// For backward compatibility
export const LIGHT_YELLOW = ACCENT.LIGHT; // For existing code
export const PRIMARY_BLUE = PRIMARY.MAIN; // For existing code
export const STATUS_BAR_YELLOW = ACCENT.MAIN;

const colors = {
  // Main UI colors
  primary: PRIMARY.MAIN,
  primaryLight: PRIMARY.LIGHT,
  primaryDark: PRIMARY.DARK,
  
  // Accent/secondary colors
  accent: ACCENT.MAIN,
  accentLight: ACCENT.LIGHT,
  accentDark: ACCENT.DARK,
  
  // Text colors
  textPrimary: NEUTRAL.GRAY_800,
  textSecondary: NEUTRAL.GRAY_600,
  textDisabled: NEUTRAL.GRAY_400,
  textInverse: NEUTRAL.WHITE,
  
  // Background colors
  background: NEUTRAL.WHITE,
  backgroundLight: NEUTRAL.GRAY_100,
  surface: NEUTRAL.WHITE,
  
  // Border colors
  border: NEUTRAL.GRAY_300,
  divider: NEUTRAL.GRAY_200,
  
  // Status colors
  success: SEMANTIC.SUCCESS,
  warning: SEMANTIC.WARNING,
  error: SEMANTIC.ERROR,
  info: SEMANTIC.INFO,
  
  // Component-specific colors
  disabled: NEUTRAL.GRAY_200,
  disabledText: NEUTRAL.GRAY_500,
  
  // Card shadows
  shadowColor: NEUTRAL.BLACK,
};

export default colors;
