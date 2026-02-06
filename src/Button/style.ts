import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    glass: lobeStaticStylish.blur,
    root: css`
      &[class*='ant-btn'] {
        > [class*='ant-btn-icon'] {
          display: flex;
        }
      }
    `,
    shadow: css`
      box-shadow: ${cssVar.boxShadowTertiary} !important;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    glass: false,
    shadow: false,
  },

  variants: {
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
