import { CSSProperties } from 'react';
import { commonStyles } from '../../styles/common.styles';

export const welcomeMessageStyles: CSSProperties = {
  color: commonStyles.colors.textSecondary,
  fontStyle: 'italic',
  textAlign: 'center',
  paddingTop: '20px',
};

export const welcomeListStyles: CSSProperties = {
  textAlign: 'left',
  display: 'inline-block',
};
