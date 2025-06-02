
export const theme = {
  colors: {
    primary: '#4F46E5', // indigo-600
    secondary: '#22D3EE', // cyan-400
    textDefault: '#374151', // gray-700
    textLight: '#6B7280', // gray-500
    textDark: '#111827', // gray-900
    textWhite: '#FFFFFF',
    textWhiteAlpha: 'rgba(255, 255, 255, 0.9)',
    glassBg: 'rgba(255, 255, 255, 0.2)',
    glassCard: 'rgba(255, 255, 255, 0.25)',
    glassCardHover: 'rgba(255, 255, 255, 0.3)',
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    error: '#EF4444', // red-500
    background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    chartTooltipBg: 'rgba(255, 255, 255, 0.95)',
    filterIconColor: '#FFFFFF',
    highContrastText: '#FFFFFF',
  },
  fontSize: {
    h1: '24px',
    h2: '20px',
    body: '16px',
    small: '14px',
    xs: '12px',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xl: '20px',
  },
  shadow: {
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    floating: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    elevated: '0 12px 40px rgba(0, 0, 0, 0.15)',
    glow: '0 8px 25px rgba(34, 211, 238, 0.4)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  zIndex: {
    modal: 9999,
    overlay: 9998,
    tooltip: 9997,
    header: 100,
    content: 10,
    background: 1,
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export type Theme = typeof theme;
