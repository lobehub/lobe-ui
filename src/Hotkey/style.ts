import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    borderless: css`
      ${lobeStaticStylish.variantBorderlessWithoutHover};
      padding-inline: 4px;
    `,
    filled: lobeStaticStylish.variantFilledWithoutHover,
    inverseThemeDark: css`
      color: ${cssVar.colorTextTertiary};
      background: color-mix(in srgb, ${cssVar.colorBgContainer} 8%, transparent);
    `,
    inverseThemeLight: css`
      color: ${cssVar.colorTextTertiary};
      background: color-mix(in srgb, ${cssVar.colorBgContainer} 16%, transparent);
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    root: css`
      overflow: hidden;

      min-width: 1.8em;
      height: 1.8em;
      padding-block: 0;
      padding-inline: 8px;
      border: none;
      border-radius: ${cssVar.borderRadiusSM};

      font-family: ${cssVar.fontFamily};
      font-size: 12px;
      line-height: 1.1;
      color: ${cssVar.colorTextSecondary};
      text-align: center;
      white-space: nowrap;
    `,
  };
});

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.inverseThemeDark,
      inverseTheme: true,
      isDarkMode: true,
    },
    {
      class: styles.inverseThemeLight,
      inverseTheme: true,
      isDarkMode: false,
    },
  ],
  defaultVariants: {
    inverseTheme: false,
    isDarkMode: false,
    variant: 'filled',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    inverseTheme: {
      false: null,
      true: null,
    },
    isDarkMode: {
      false: null,
      true: null,
    },
    variant: {
      borderless: styles.borderless,
      filled: styles.filled,
      outlined: styles.outlined,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
