import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css }) => {
  return {
    borderless: css`
      &[class*='ant-select'] {
        > [class*='ant-select-selector'] {
          ${lobeStaticStylish.variantBorderless}
        }
      }
    `,
    filled: css`
      &[class*='ant-select'] {
        > [class*='ant-select-selector'] {
          ${lobeStaticStylish.variantFilled}
        }
      }
    `,
    outlined: css`
      &[class*='ant-select'] {
        > [class*='ant-select-selector'] {
          ${lobeStaticStylish.variantOutlined}
        }
      }
    `,
    root: css``,
    shadow: css`
      &[class*='ant-select'] {
        > [class*='ant-select-selector'] {
          ${lobeStaticStylish.shadow}
        }
      }
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    shadow: false,
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
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
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
