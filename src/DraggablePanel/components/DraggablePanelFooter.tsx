'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { type DivProps } from '@/types';

import { useStyles } from './style';

export type DraggablePanelFooterProps = DivProps;

const DraggablePanelFooter = memo<DraggablePanelFooterProps>(({ className, ...rest }) => {
  const { cx, styles } = useStyles();
  return (
    <Flexbox
      align={'center'}
      className={cx(styles.footer, className)}
      flex={'none'}
      gap={8}
      horizontal
      justify={'flex-start'}
      {...rest}
    />
  );
});

DraggablePanelFooter.displayName = 'DraggablePanelFooter';

export default DraggablePanelFooter;
