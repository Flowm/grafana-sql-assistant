import { CSSProperties } from 'react';
import { flexRow } from '../../styles/common.styles';

export const chatInputContainerStyles: CSSProperties = {
  ...flexRow,
  gap: '8px',
  width: '100%',
};

export const chatInputStyles: CSSProperties = {
  flex: 1,
};

export const chatInputTextAreaStyles: CSSProperties = {
  minHeight: '72px', // 3 rows approximately
  resize: 'vertical',
};
