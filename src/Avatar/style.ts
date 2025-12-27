import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    loading: css`
      position: absolute;
      color: #fff;
      background: ${cssVar.colorBgMask};
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      flex: none;
      background: transparent;

      &[class*='ant-avatar'] {
        user-select: none;

        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        border: none;

        [class*='ant-avatar-string'] {
          transform: none !important;

          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;
          padding: 0;

          font-size: inherit;
          font-weight: bolder;
          line-height: 1;
          color: inherit;
        }
      }
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    shadow: false,
    variant: 'borderless',
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
