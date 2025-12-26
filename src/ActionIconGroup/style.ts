import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderless,
    disabled: lobeStaticStylish.disabled,
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
  defaultVariants: {
    disabled: false,
    glass: false,
    shadow: false,
    variant: 'outlined',
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
    disabled: {
      false: null,
      true: styles.disabled,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
