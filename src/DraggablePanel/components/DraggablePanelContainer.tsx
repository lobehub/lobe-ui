'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { type DivProps } from '@/types';

import { useStyles } from './style';

export type DraggablePanelContainerProps = DivProps;

const DraggablePanelContainer = memo<DraggablePanelContainerProps>(({ className, ...rest }) => {
  const { cx, styles } = useStyles();
  return <Flexbox className={cx(styles.container, className)} {...rest} />;
});

DraggablePanelContainer.displayName = 'DraggablePanelContainer';

export default DraggablePanelContainer;
