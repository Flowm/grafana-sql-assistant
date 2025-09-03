import { CSSProperties } from 'react';

export const welcomeMessageStyles: CSSProperties = {
  color: 'var(--text-color-secondary)',
  fontStyle: 'italic',
  textAlign: 'center',
  paddingTop: '20px',
};

export const chatHistoryStyles: CSSProperties = {
  height: '500px',
  overflowY: 'auto',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: 'var(--background-color-secondary)',
};

export const chatMessageWrapperStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '12px',
  width: '100%',
};

export const chatMessageStyles = (messageRole: 'user' | 'assistant'): CSSProperties => ({
  maxWidth: '90%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: messageRole === 'user' ? '#007acc' : 'var(--background-color-primary)',
  color: messageRole === 'user' ? 'white' : 'var(--text-color-primary)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: messageRole === 'assistant' ? '1px solid var(--border-color)' : 'none',
  fontSize: '14px',
  lineHeight: '1.5',
});

export const thinkingStyles: CSSProperties = {
  opacity: 0.7,
};

export const chatHeaderStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const chatInputStyles: CSSProperties = {
  flex: 1,
};

export const toolCallsIndicatorStyles: CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-color-secondary)',
};

export const welcomeListStyles: CSSProperties = {
  textAlign: 'left',
  display: 'inline-block',
};
