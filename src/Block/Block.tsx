'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { toDataAttributes } from '@/utils/bem';

import { blockClasses } from './stable';
import { styles } from './style';
import type { BlockProps } from './type';

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: stylish.variantFilledWithoutHover,
  outlined: stylish.variantOutlinedWithoutHover,
};

const clickableVariantStyles = {
  borderless: styles.clickableBorderless,
  filled: styles.clickableFilled,
  outlined: styles.clickableOutlined,
};

export const BlockImpl: FC<BlockProps & { xstyle?: Parameters<typeof styleProps>[0] }> = ({
  className,
  variant = 'filled',
  shadow,
  glass,
  children,
  clickable,
  ref,
  style,
  xstyle,
  ...rest
}) => {
  return (
    <Flexbox
      ref={ref}
      {...toDataAttributes({ clickable, glass, shadow, variant })}
      {...rest}
      {...styleProps(
        [
          styles.root,
          variantStyles[variant],
          clickable && styles.clickableRoot,
          glass && styles.glass,
          shadow && styles.shadow,
          clickable && clickableVariantStyles[variant],
          xstyle,
        ],
        clsx(blockClasses(), className),
        style,
      )}
    >
      {children}
    </Flexbox>
  );
};

BlockImpl.displayName = 'Block';

const Block = BlockImpl as FC<BlockProps>;

export default Block;
