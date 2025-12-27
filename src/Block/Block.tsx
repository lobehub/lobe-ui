'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import { variants } from './style';
import type { BlockProps } from './type';

const Block: FC<BlockProps> = ({
  className,
  variant = 'filled',
  shadow,
  glass,
  children,
  clickable,
  ref,
  ...rest
}) => {
  return (
    <Flexbox
      className={cx(variants({ clickable, glass, shadow, variant }), className)}
      ref={ref}
      {...rest}
    >
      {children}
    </Flexbox>
  );
};

Block.displayName = 'Block';

export default Block;
