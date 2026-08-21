import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    content: css`
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
    `,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    img: css`
      flex: none;
      width: 100%;
      height: 100%;
      object-fit: cover;
    `,
    loading: css`
      position: absolute;
      inset: 0;
      color: #fff;
      background: ${cssVar.colorBgMask};
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      user-select: none;

      position: relative;

      overflow: hidden;
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;

      background: transparent;
    `,
    shadow: lobeStaticStylish.shadow,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
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
  },
});
