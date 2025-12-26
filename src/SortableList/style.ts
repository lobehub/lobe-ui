import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    container: css`
      padding: 0;
      list-style: none;
    `,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    item: css`
      overflow: hidden;
      box-sizing: border-box;
      border-radius: ${cssVar.borderRadius};
      list-style: none;
    `,
    itemVariant: css`
      padding-block: 4px;
      padding-inline: 4px 16px;
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  };
});

export const variants = cva(styles.item, {
  compoundVariants: [
    {
      className: styles.itemVariant,
      variant: 'outlined',
    },
    {
      className: styles.itemVariant,
      variant: 'filled',
    },
  ],
  defaultVariants: {
    variant: 'borderless',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
