import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css }) => ({
  borderless: lobeStaticStylish.variantBorderlessWithoutHover,
  close: css`
    cursor: pointer;

    display: inline-flex;
    gap: 0;
    align-items: center;
    justify-content: center;

    margin: 0;
    padding: 0;
    border: none;

    color: inherit;

    background: none;
  `,
  filled: lobeStaticStylish.variantFilledWithoutHover,
  large: css`
    height: 28px;
    padding-inline: 12px;
    border-radius: 6px;
  `,
  outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  round: css`
    border-radius: 999px;
  `,
  roundLarge: css`
    padding-inline: 14px;
  `,
  roundMiddle: css`
    padding-inline: 10px;
  `,
  roundSmall: css`
    padding-inline: 8px;
  `,
  root: css`
    user-select: none;

    display: inline-flex;
    gap: 0.4em;
    align-items: center;
    justify-content: center;

    width: fit-content;
    height: 22px;
    margin: 0;

    font-size: inherit;
    line-height: 1.2;

    span {
      margin: 0;
      line-height: inherit;
    }
  `,
  small: css`
    height: 20px;
    padding-inline: 4px;
    border-radius: 3px;
  `,
}));

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      className: styles.roundSmall,
      shape: 'round',
      size: 'small',
    },
    {
      className: styles.roundMiddle,
      shape: 'round',
      size: 'middle',
    },
    {
      className: styles.roundLarge,
      shape: 'round',
      size: 'large',
    },
  ],
  defaultVariants: {
    shape: 'normal',
    size: 'middle',
    variant: 'filled',
  },
  variants: {
    shape: {
      normal: null,
      round: styles.round,
    },
    size: {
      large: styles.large,
      middle: null,
      small: styles.small,
    },
    variant: {
      borderless: styles.borderless,
      filled: styles.filled,
      outlined: styles.outlined,
      solid: styles.filled,
    },
  },
});
