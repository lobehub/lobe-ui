'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

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
      className={clsx(
        'lobe-block',
        variant === 'filled' && 'lobe-block--filled',
        variant === 'outlined' && 'lobe-block--outlined',
        variant === 'borderless' && 'lobe-block--borderless',
        clickable && 'lobe-block--clickable',
        glass && 'lobe-block--glass',
        shadow && 'lobe-block--shadow',
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Flexbox>
  );
};

Block.displayName = 'Block';

export default Block;
