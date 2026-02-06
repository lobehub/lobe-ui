import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    hightlight: css`
      overflow: auto hidden;
      flex: 1;
      height: 100%;
      padding: 0;

      pre {
        display: flex;
        align-items: center;
        height: 100%;
      }
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      position: relative;

      overflow: hidden;

      max-width: 100%;
      height: 38px;
      padding-block: 0;
      padding-inline: 12px 8px;
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
});
