import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  borderless: lobeStaticStylish.variantBorderlessWithoutHover,
  close: css`
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
  `,
  content: css`
    padding: 16px;
  `,
  cover: css`
    align-self: center;
  `,
  desc: css`
    color: ${cssVar.colorTextDescription};
  `,
  filledDark: css`
    ${lobeStaticStylish.variantFilledWithoutHover};
    background: linear-gradient(
      to bottom,
      ${cssVar.colorFillTertiary},
      ${cssVar.colorFillQuaternary}
    );
  `,
  filledLight: css`
    ${lobeStaticStylish.variantFilledWithoutHover};
    background: linear-gradient(
      to bottom,
      ${cssVar.colorFillQuaternary},
      ${cssVar.colorFillTertiary}
    );
  `,
  outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  root: css`
    position: relative;
    overflow: hidden;
    border-radius: ${cssVar.borderRadiusLG};
  `,
  shadow: lobeStaticStylish.shadow,
  title: css`
    font-size: 16px;
    font-weight: bold;
  `,
}));

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.filledDark,
      isDarkMode: true,
      variant: 'filled',
    },
    {
      class: styles.filledLight,
      isDarkMode: false,
      variant: 'filled',
    },
  ],
  defaultVariants: {
    isDarkMode: false,
    shadow: false,
    variant: 'filled',
  },

  variants: {
    isDarkMode: {
      false: null,
      true: null,
    },
    shadow: {
      false: null,
      true: styles.shadow,
    },
    variant: {
      borderless: styles.borderless,
      filled: null,
      outlined: styles.outlined,
    },
  },
});
