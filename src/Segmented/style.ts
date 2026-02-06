import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: css`
      border: 1px solid ${cssVar.colorFillQuaternary};
      background: ${cssVar.colorBgLayout};
    `,
    glass: lobeStaticStylish.blur,
    outlined: css`
      border: 1px solid ${cssVar.colorBorderSecondary};
      background: transparent;
    `,
    root: css``,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
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
