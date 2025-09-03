import { CSSProperties } from 'react';
import { commonStyles, scrollableContainer } from '../../styles/common.styles';

export const chatHistoryContainerStyles: CSSProperties = {
  ...scrollableContainer,
  height: '500px',
  border: `1px solid ${commonStyles.colors.borderColor}`,
  borderRadius: commonStyles.borderRadius,
  padding: commonStyles.padding.extraLarge,
  backgroundColor: commonStyles.colors.backgroundSecondary,
};

export const chatHistoryContentStyles: CSSProperties = {
  width: '100%',
  height: '100%',
};

export const chatMessagesListStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
};
