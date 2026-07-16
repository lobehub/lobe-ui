import { createStaticStyles, responsive } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  description: css`
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  extra: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
  `,
  filled: css`
    background: ${cssVar.colorFillQuaternary};
  `,
  header: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  `,
  percentDown: css`
    color: ${cssVar.colorWarning};
  `,
  percentUp: css`
    color: ${cssVar.colorSuccess};
  `,
  outlinedDark: css`
    border: 1px solid ${cssVar.colorFillTertiary};

    &:hover {
      border-color: ${cssVar.colorFillSecondary};
    }
  `,
  outlinedLight: css`
    border: 1px solid ${cssVar.colorFillSecondary};

    &:hover {
      border-color: ${cssVar.colorFill};
    }
  `,
  root: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;

    padding-block: 16px;
    padding-inline: 20px;
    border-radius: ${cssVar.borderRadiusLG};

    transition: border-color 160ms cubic-bezier(0.32, 0.72, 0, 1);

    ${responsive.sm} {
      border: none;
      border-radius: 0;
      background: ${cssVar.colorBgContainer};
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  statistic: css`
    display: flex;
    gap: 4px;
    align-items: center;

    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  statisticTitle: css`
    font-weight: normal;
  `,
  statisticValue: css`
    font-weight: 600;
  `,
  title: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    gap: 6px;
    align-items: center;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: ${cssVar.colorTextSecondary};
  `,
  value: css`
    display: flex;
    gap: 2px;
    align-items: baseline;

    font-size: 28px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
    letter-spacing: -0.01em;
  `,
}));

export const variants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.outlinedDark,
      isDarkMode: true,
      variant: 'outlined',
    },
    {
      class: styles.outlinedLight,
      isDarkMode: false,
      variant: 'outlined',
    },
  ],
  defaultVariants: {
    isDarkMode: false,
    variant: 'borderless',
  },
  variants: {
    isDarkMode: {
      false: null,
      true: null,
    },
    variant: {
      borderless: null,
      filled: styles.filled,
      outlined: null,
    },
  },
});
