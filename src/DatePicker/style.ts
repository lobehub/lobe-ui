import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css }) => {
  return {
    borderless: lobeStaticStylish.variantBorderless,
    filled: lobeStaticStylish.variantFilled,
    outlined: lobeStaticStylish.variantOutlined,
    root: css``,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    shadow: false,
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
      underlined: null,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
  },
});
