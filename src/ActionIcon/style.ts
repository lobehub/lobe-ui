import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: lobeStaticStylish.active,
    borderless: lobeStaticStylish.variantBorderless,
    dangerBorderless: lobeStaticStylish.variantBorderlessDanger,
    dangerFilled: lobeStaticStylish.variantFilledDanger,
    dangerOutlined: lobeStaticStylish.variantOutlinedDanger,
    dangerRoot: css`
      &:hover {
        color: ${cssVar.colorError};
      }

      &:active {
        color: ${cssVar.colorErrorActive};
      }
    `,
    disabled: lobeStaticStylish.disabled,
    filled: lobeStaticStylish.variantFilled,
    glass: lobeStaticStylish.blur,
    outlined: lobeStaticStylish.variantOutlined,
    root: css`
      cursor: pointer;

      position: relative;

      overflow: hidden;

      color: ${cssVar.colorTextTertiary};

      transition:
        color 400ms ${cssVar.motionEaseOut},
        background 100ms ${cssVar.motionEaseOut};

      &:hover {
        color: ${cssVar.colorTextSecondary};
      }

      &:active {
        color: ${cssVar.colorText};
      }
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      className: styles.dangerFilled,
      danger: true,
      variant: 'filled',
    },
    {
      className: styles.dangerBorderless,
      danger: true,
      variant: 'borderless',
    },
    {
      className: styles.dangerOutlined,
      danger: true,
      variant: 'outlined',
    },
  ],
  defaultVariants: {
    active: false,
    danger: false,
    disabled: false,
    glass: false,
    shadow: false,
    variant: 'borderless',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
    glass: {
      false: null,
      true: styles.glass,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
    active: {
      false: null,
      true: styles.active,
    },
    danger: {
      false: null,
      true: styles.dangerRoot,
    },
    disabled: {
      false: null,
      true: styles.disabled,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
