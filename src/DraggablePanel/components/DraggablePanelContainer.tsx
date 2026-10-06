'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { cx } from '@/styles';
import { type DivProps } from '@/types';

import { styles } from './style';

export type DraggablePanelContainerProps = DivProps;

const DraggablePanelContainer = memo<DraggablePanelContainerProps>(({ className, ...rest }) => {
  return <Flexbox className={cx(styles.container, className)} {...rest} />;
});

DraggablePanelContainer.displayName = 'DraggablePanelContainer';

export default DraggablePanelContainer;
