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

export const toolCallsCollapsibleContainerStyles: CSSProperties = {
  marginBottom: '8px',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  backgroundColor: 'var(--background-color-tertiary)',
};

export const toolCallsHeaderStyles: CSSProperties = {
  padding: '8px 12px',
  backgroundColor: 'var(--background-color-secondary)',
  borderBottom: '1px solid var(--border-color)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
  userSelect: 'none',
  transition: 'background-color 0.2s ease',
  borderTopLeftRadius: '6px',
  borderTopRightRadius: '6px',
};

export const toolCallsContentStyles: CSSProperties = {
  padding: '8px',
};

export const toolCallContainerStyles: CSSProperties = {
  marginBottom: '6px',
  padding: '6px 8px',
  backgroundColor: 'var(--background-color-secondary)',
  borderRadius: '4px',
  border: '1px solid var(--border-color)',
  fontSize: '11px',
  borderLeft: '3px solid var(--primary-color)',
};

export const toolCallHeaderStyles: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '3px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
};

export const toolCallArgumentsStyles: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '10px',
  color: 'var(--text-color-secondary)',
  marginTop: '3px',
  padding: '3px 4px',
  backgroundColor: 'var(--background-color-tertiary)',
  borderRadius: '2px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: '100px',
  overflowY: 'auto',
};

export const toolCallStatusStyles = (running: boolean, error?: string): CSSProperties => ({
  fontSize: '10px',
  fontWeight: 'normal',
  color: error ? 'var(--error-color)' : running ? 'var(--warning-color)' : 'var(--success-color)',
});
