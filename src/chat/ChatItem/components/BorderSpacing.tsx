import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { chatChatItemClasses } from '../stable';
import { styles } from '../style';

export interface BorderSpacingProps {
  borderSpacing?: number;
}

const BorderSpacing: FC<BorderSpacingProps> = ({ borderSpacing }) => {
  if (!borderSpacing) return null;

  return (
    <div
      {...styleProps(styles.spacing, chatChatItemClasses('spacing'), { width: borderSpacing })}
    />
  );
};

export default BorderSpacing;
