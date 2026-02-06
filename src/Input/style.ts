import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: css`
      &[class*='ant-input'] {
        ${lobeStaticStylish.variantBorderless}
        &:hover {
          ${lobeStaticStylish.variantBorderlessWithoutHover}
        }
      }
    `,
    borderlessOPT: css`
      &[class*='ant-otp'] {
        [class*='ant-otp-input'] {
          ${lobeStaticStylish.variantBorderless};
        }
      }
    `,
    filled: cx(
      lobeStaticStylish.variantFilled,
      css`
        &:focus-within {
          ${lobeStaticStylish.variantFilledWithoutHover}
        }
      `,
    ),

    filledOPT: css`
      &[class*='ant-otp'] {
        [class*='ant-otp-input'] {
          ${lobeStaticStylish.variantFilled};
        }
      }
    `,
    outlined: lobeStaticStylish.variantOutlined,
    outlinedOPT: css`
      &[class*='ant-otp'] {
        [class*='ant-otp-input'] {
          ${lobeStaticStylish.variantOutlined};
        }
      }
    `,
    root: css``,
    rootOPT: css`
      &[class*='ant-otp'] {
        [class*='ant-otp-input'] {
          &:focus-within {
            border-color: ${cssVar.colorBorder};
          }
        }
      }
    `,
    shadow: lobeStaticStylish.shadow,
    shadowOPT: css`
      &[class*='ant-otp'] {
        [class*='ant-otp-input'] {
          ${lobeStaticStylish.shadow};
        }
      }
    `,
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

export const variantsOPT = cva(styles.rootOPT, {
  defaultVariants: {
    shadow: false,
  },

  variants: {
    variant: {
      filled: styles.filledOPT,
      outlined: styles.outlinedOPT,
      borderless: styles.borderlessOPT,
      underlined: null,
    },
    shadow: {
      false: null,
      true: styles.shadowOPT,
    },
  },
});
