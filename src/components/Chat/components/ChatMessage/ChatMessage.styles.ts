import { CSSProperties } from 'react';
import { commonStyles, flexRow, textBreak } from '../../styles/common.styles';

export const chatMessageWrapperStyles: CSSProperties = {
  ...flexRow,
  marginBottom: '12px',
  width: '100%',
};

export const chatMessageStyles = (messageRole: 'user' | 'assistant'): CSSProperties => ({
  maxWidth: '90%',
  padding: commonStyles.padding.large,
  borderRadius: '12px',
  backgroundColor: messageRole === 'user' ? '#007acc' : commonStyles.colors.backgroundPrimary,
  color: messageRole === 'user' ? 'white' : commonStyles.colors.textPrimary,
  ...textBreak,
  boxShadow: commonStyles.shadows.light,
  border: messageRole === 'assistant' ? `1px solid ${commonStyles.colors.borderColor}` : 'none',
  fontSize: commonStyles.typography.fontSize.normal,
  lineHeight: commonStyles.typography.lineHeight.normal,
});

export const thinkingStyles: CSSProperties = {
  opacity: 0.7,
  fontStyle: 'italic',
  color: commonStyles.colors.textSecondary,
};

export const userMessageContainerStyles: CSSProperties = {
  ...chatMessageWrapperStyles,
  justifyContent: 'flex-end',
};

export const assistantMessageContainerStyles: CSSProperties = {
  ...chatMessageWrapperStyles,
  justifyContent: 'flex-start',
};
