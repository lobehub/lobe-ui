import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  aligned: css`
    display: flex;
    width: 100%;
  `,
  button: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 28px;
    height: 28px;
    padding-inline: 6px;
    border: none;
    border-radius: ${cssVar.borderRadius};

    font-size: 13px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextSecondary};

    background: transparent;

    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }

    &:disabled {
      cursor: default;
      color: ${cssVar.colorTextQuaternary};
      background: transparent;
    }

    &[aria-current='page'] {
      font-weight: 600;
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }
  `,
  center: css`
    justify-content: center;
  `,
  ellipsis: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 28px;

    color: ${cssVar.colorTextQuaternary};
    letter-spacing: 2px;
  `,
  end: css`
    justify-content: flex-end;
  `,
  jumper: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    margin-inline-start: 8px;

    font-size: 13px;
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;
  `,
  jumperInput: css`
    width: 50px;
  `,
  root: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    font-variant-numeric: tabular-nums;
  `,
  simplePager: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    font-size: 13px;
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;
  `,
  simpleSlash: css`
    color: ${cssVar.colorTextQuaternary};
  `,
  small: css`
    min-width: 24px;
    height: 24px;
    font-size: 12px;
  `,
  smallEllipsis: css`
    width: 24px;
  `,
  start: css`
    justify-content: flex-start;
  `,
  total: css`
    margin-inline-end: 8px;
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
    white-space: nowrap;
  `,
}));

export const buttonVariants = cva(styles.button, {
  defaultVariants: {
    size: 'middle',
  },
  variants: {
    size: {
      middle: null,
      small: styles.small,
    },
  },
});

export const ellipsisVariants = cva(styles.ellipsis, {
  defaultVariants: {
    size: 'middle',
  },
  variants: {
    size: {
      middle: null,
      small: styles.smallEllipsis,
    },
  },
});
