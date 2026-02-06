import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderless,
    disabled: lobeStaticStylish.disabled,
    error: css`
      border: 1px solid ${cssVar.colorError};
    `,
    errorText: css`
      font-size: 12px;
      color: ${cssVar.colorError};
    `,
    filled: lobeStaticStylish.variantFilled,
    focused: css`
      background: ${cssVar.colorFillSecondary} !important;
    `,
    hiddenInput: css`
      cursor: text;

      position: absolute;
      z-index: -1;
      inset-block-start: 0;
      inset-inline-start: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
    `,
    outlined: lobeStaticStylish.variantOutlined,
    placeholder: css`
      color: ${cssVar.colorTextDescription};
    `,
    root: css`
      cursor: pointer;

      position: relative;

      max-width: 100%;
      height: 36px;
      padding-block: 0;
      padding-inline: 12px;
      border-radius: ${cssVar.borderRadius};
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    disabled: false,
    error: false,
    shadow: false,
    variant: 'outlined',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
    focused: {
      false: null,
      true: styles.focused,
    },
    error: {
      fales: null,
      true: styles.error,
    },
    disabled: {
      false: null,
      true: styles.disabled,
    },
  },
});
