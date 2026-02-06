import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    clickableBorderless: lobeStaticStylish.variantBorderless,
    clickableFilled: lobeStaticStylish.variantFilled,
    clickableOutlined: lobeStaticStylish.variantOutlined,
    clickableRoot: css`
      cursor: pointer;
    `,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    glass: lobeStaticStylish.blur,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;
      border-radius: ${cssVar.borderRadius};
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.clickableBorderless,
      clickable: true,
      variant: 'borderless',
    },
    {
      class: styles.clickableFilled,
      clickable: true,
      variant: 'filled',
    },
    {
      class: styles.clickableOutlined,
      clickable: true,
      variant: 'outlined',
    },
  ],
  defaultVariants: {
    clickable: false,
    glass: false,
    shadow: false,
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
    clickable: {
      false: null,
      true: styles.clickableRoot,
    },
    glass: {
      false: null,
      true: styles.glass,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
  },
});
