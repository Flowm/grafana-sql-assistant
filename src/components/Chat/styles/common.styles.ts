import { CSSProperties } from 'react';

export const commonStyles = {
  // Common border styles
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  smallBorderRadius: '4px',
  mediumBorderRadius: '6px',

  // Common spacing
  padding: {
    small: '6px 8px',
    medium: '8px 12px',
    large: '12px 16px',
    extraLarge: '16px',
  },

  // Common colors
  colors: {
    primary: 'var(--primary-color)',
    secondary: 'var(--text-color-secondary)',
    error: 'var(--error-color)',
    warning: 'var(--warning-color)',
    success: 'var(--success-color)',
    backgroundPrimary: 'var(--background-color-primary)',
    backgroundSecondary: 'var(--background-color-secondary)',
    backgroundTertiary: 'var(--background-color-tertiary)',
    textPrimary: 'var(--text-color-primary)',
    textSecondary: 'var(--text-color-secondary)',
    borderColor: 'var(--border-color)',
  },

  // Common shadows
  shadows: {
    light: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 2px 6px rgba(0, 0, 0, 0.15)',
  },

  // Common typography
  typography: {
    fontSize: {
      small: '10px',
      extraSmall: '11px',
      medium: '12px',
      normal: '14px',
    },
    fontFamily: {
      monospace: 'monospace',
    },
    lineHeight: {
      normal: '1.5',
    },
  },

  // Common transitions
  transitions: {
    fast: '0.2s ease',
  },
};

// Common utility styles
export const scrollableContainer: CSSProperties = {
  overflowY: 'auto',
};

export const flexRow: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

export const flexColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export const flexCenter: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const flexSpaceBetween: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const textBreak: CSSProperties = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

export const noSelect: CSSProperties = {
  userSelect: 'none',
};

export const clickable: CSSProperties = {
  cursor: 'pointer',
};
