import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  borderless: cx(
    lobeStaticStylish.variantBorderlessWithoutHover,
    css`
      padding: 0;
      border-radius: unset;
    `,
  ),
  compact: css`
    &[class*='ant-menu'] {
      [class*='ant-menu-item-divider'] {
        margin: 0;
      }
    }
  `,
  filled: lobeStaticStylish.variantFilledWithoutHover,
  outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  root: css`
    &[class*='ant-menu'] {
      flex: 1;

      padding: 4px;
      border: none !important;
      border-radius: ${cssVar.borderRadiusLG};

      background: transparent;

      [class*='ant-menu-sub'][class*='ant-menu-inline'] {
        background: transparent;

        > [class*='ant-menu-item'] {
          padding-inline-start: 36px !important;
        }
      }

      [class*='ant-menu-item-divider'] {
        margin-block: 1em;
      }
    }
  `,
  shadow: lobeStaticStylish.shadow,
}));

export const variants = cva(styles.root, {
  defaultVariants: {
    compact: false,
    shadow: false,
    variant: 'borderless',
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
    compact: {
      false: null,
      true: styles.compact,
    },
  },
});
