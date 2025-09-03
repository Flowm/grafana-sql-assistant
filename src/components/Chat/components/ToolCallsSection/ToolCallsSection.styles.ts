import { CSSProperties } from 'react';
import {
  commonStyles,
  flexSpaceBetween,
  noSelect,
  clickable,
  textBreak,
  scrollableContainer,
} from '../../styles/common.styles';

export const toolCallsCollapsibleContainerStyles: CSSProperties = {
  marginBottom: '8px',
  border: `1px solid ${commonStyles.colors.borderColor}`,
  borderRadius: commonStyles.mediumBorderRadius,
  backgroundColor: commonStyles.colors.backgroundTertiary,
};

export const toolCallsHeaderStyles: CSSProperties = {
  ...flexSpaceBetween,
  ...noSelect,
  ...clickable,
  padding: commonStyles.padding.medium,
  backgroundColor: commonStyles.colors.backgroundSecondary,
  borderBottom: `1px solid ${commonStyles.colors.borderColor}`,
  fontSize: commonStyles.typography.fontSize.medium,
  fontWeight: 'bold',
  transition: `background-color ${commonStyles.transitions.fast}`,
  borderTopLeftRadius: commonStyles.mediumBorderRadius,
  borderTopRightRadius: commonStyles.mediumBorderRadius,
};

export const toolCallsHeaderHoverStyles: CSSProperties = {
  backgroundColor: commonStyles.colors.backgroundTertiary,
};

export const toolCallsContentStyles: CSSProperties = {
  padding: commonStyles.padding.medium,
};

export const toolCallContainerStyles: CSSProperties = {
  marginBottom: '6px',
  padding: commonStyles.padding.small,
  backgroundColor: commonStyles.colors.backgroundSecondary,
  borderRadius: commonStyles.smallBorderRadius,
  border: `1px solid ${commonStyles.colors.borderColor}`,
  fontSize: commonStyles.typography.fontSize.extraSmall,
  borderLeft: `3px solid ${commonStyles.colors.primary}`,
};

export const toolCallHeaderStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  marginBottom: '3px',
  fontSize: commonStyles.typography.fontSize.extraSmall,
  gap: '8px',
  flexWrap: 'wrap',
};

export const toolCallInlineDisplayStyles: CSSProperties = {
  fontFamily: commonStyles.typography.fontFamily.monospace,
  fontSize: commonStyles.typography.fontSize.extraSmall,
  color: commonStyles.colors.textPrimary,
  backgroundColor: commonStyles.colors.backgroundTertiary,
  padding: '2px 4px',
  borderRadius: '3px',
  border: `1px solid ${commonStyles.colors.borderColor}`,
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
};

export const toolCallArgumentsStyles: CSSProperties = {
  ...textBreak,
  ...scrollableContainer,
  fontFamily: commonStyles.typography.fontFamily.monospace,
  fontSize: commonStyles.typography.fontSize.small,
  color: commonStyles.colors.textSecondary,
  marginTop: '3px',
  padding: '3px 4px',
  backgroundColor: commonStyles.colors.backgroundTertiary,
  borderRadius: '2px',
  maxHeight: '100px',
};

export const toolCallErrorStyles: CSSProperties = {
  ...toolCallArgumentsStyles,
  color: commonStyles.colors.error,
};

export const toolCallStatusStyles = (running: boolean, error?: string): CSSProperties => ({
  fontSize: commonStyles.typography.fontSize.small,
  fontWeight: 'normal',
  color: error ? commonStyles.colors.error : running ? commonStyles.colors.warning : commonStyles.colors.success,
});

export const toolCallsIndicatorStyles: CSSProperties = {
  fontSize: commonStyles.typography.fontSize.medium,
  color: commonStyles.colors.textSecondary,
};
