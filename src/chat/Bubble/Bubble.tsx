'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { variants } from './style';
import type { BubbleProps } from './type';

const Bubble = memo<BubbleProps>(
  ({ ref, variant = 'filled', shadow, className, children, ...rest }) => {
    return (
      <Flexbox className={cx(variants({ shadow, variant }), className)} ref={ref} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

Bubble.displayName = 'Bubble';

export default Bubble;
