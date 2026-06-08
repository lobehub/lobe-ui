import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  borderless: lobeStaticStylish.variantBorderlessWithoutHover,
  filled: lobeStaticStylish.variantFilledWithoutHover,
  large: css`
    &.${prefixCls}-tag {
      height: 28px;
      padding-inline: 12px;
      border-radius: 6px !important;
    }
  `,
  outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  round: css`
    &.${prefixCls}-tag {
      border-radius: 999px !important;
    }
  `,
  roundLarge: css`
    &.${prefixCls}-tag {
      padding-inline: 14px;
    }
  `,
  roundMiddle: css`
    &.${prefixCls}-tag {
      padding-inline: 10px;
    }
  `,
  roundSmall: css`
    &.${prefixCls}-tag {
      padding-inline: 8px;
    }
  `,
  root: css`
    color: ${cssVar.colorTextSecondary};

    &.${prefixCls}-tag {
      user-select: none;

      display: flex;
      gap: 0.4em;
      align-items: center;
      justify-content: center;

      width: fit-content;
      height: 22px;
      margin: 0;
      border-radius: 3px;

      line-height: 1.2;

      span {
        margin: 0;
      }

      span:not(.anticon) {
        line-height: inherit;
      }
    }
  `,
  small: css`
    &.${prefixCls}-tag {
      height: 20px;
      padding-inline: 4px;
      border-radius: 3px;
    }
  `,
}));

export const variants = cva(styles.root, {
  defaultVariants: {
    shape: 'normal',
    size: 'middle',
    variant: 'filled',
  },

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

  variants: {
    shape: {
      normal: null,
      round: styles.round,
    },
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
      solid: styles.filled,
    },
    size: {
      small: styles.small,
      middle: null,
      large: styles.large,
    },
  },
});
