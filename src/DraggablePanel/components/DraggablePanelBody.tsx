'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { cx } from '@/styles';
import { type DivProps } from '@/types';

import { styles } from './style';

export type DraggablePanelBodyProps = DivProps;

const DraggablePanelBody = memo<DraggablePanelBodyProps>(({ className, ...rest }) => {
  return <Flexbox className={cx(styles.body, className)} flex={1} {...rest} />;
});

DraggablePanelBody.displayName = 'DraggablePanelBody';

export default DraggablePanelBody;
