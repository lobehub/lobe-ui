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

// variants 依赖 theme.isDarkMode，需要在组件中动态创建
export const createVariants = (isDarkMode: boolean) =>
  cva(styles.root, {
    defaultVariants: {
      shadow: false,
      variant: 'filled',
    },
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    variants: {
      variant: {
        filled: isDarkMode ? styles.filledDark : styles.filledLight,
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
