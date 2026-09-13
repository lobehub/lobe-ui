import { createStaticStyles, cssVar, keyframes } from 'antd-style';
import { cva } from 'class-variance-authority';

const pulse = keyframes`
  to {
    scale: 2.4;
    opacity: 0;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  pill: css`
    display: inline-block;

    box-sizing: border-box;
    min-width: 18px;
    height: 18px;
    padding-inline: 5px;
    border-radius: 999px;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    line-height: 18px;
    color: ${cssVar.colorWhite};
    text-align: center;
    white-space: nowrap;

    background: ${cssVar.colorError};
    box-shadow: 0 0 0 1.5px ${cssVar.colorBgContainer};
  `,
  pillAbsolute: css`
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
  `,
  pillDot: css`
    width: 8px;
    min-width: 0;
    height: 8px;
    padding: 0;

    box-shadow: none;
  `,
  pillSmall: css`
    min-width: 14px;
    height: 14px;
    font-size: 11px;
    line-height: 14px;
  `,
  statusDot: css`
    position: relative;

    flex-shrink: 0;

    width: 6px;
    height: 6px;
    border-radius: 50%;

    background: ${cssVar.colorTextQuaternary};
  `,
  statusDotProcessing: css`
    &::after {
      content: '';

      position: absolute;
      inset: -1px;

      border: 1px solid currentcolor;
      border-radius: 50%;

      animation: ${pulse} 1.2s ease-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      &::after {
        animation: none;
      }
    }
  `,
  statusRoot: css`
    display: inline-flex;
    gap: 8px;
    align-items: center;
  `,
  statusText: css`
    color: ${cssVar.colorText};
  `,
  wrapper: css`
    position: relative;
    display: inline-block;
  `,
}));

export const statusColor: Record<string, string> = {
  default: cssVar.colorTextQuaternary,
  error: cssVar.colorError,
  processing: cssVar.colorInfo,
  success: cssVar.colorSuccess,
  warning: cssVar.colorWarning,
};

export const pillSize = cva(styles.pill, {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: null,
      small: styles.pillSmall,
    },
  },
});
