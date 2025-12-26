import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: cx(
      lobeStaticStylish.variantFilledWithoutHover,
      css`
        background: ${cssVar.colorBgContainer};
      `,
    ),
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;
      border-radius: ${cssVar.borderRadius};
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    shadow: false,
    variant: 'filled',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
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
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
