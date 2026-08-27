import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  item: css`
    cursor: pointer;
    user-select: none;

    display: inline-flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;
    justify-content: center;

    border: 0;
    border-radius: ${cssVar.borderRadius};

    font: inherit;
    font-size: 12px;
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;

    background: transparent;
    outline: none;

    transition:
      background 120ms ${cssVar.motionEaseOut},
      color 120ms ${cssVar.motionEaseOut};

    &:hover:not([data-disabled]) {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &[data-pressed] {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &[data-pressed]:hover:not([data-disabled]) {
      background: ${cssVar.colorFill};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: -2px;
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
    }
  `,
  itemIcon: css`
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
  `,
  itemLabel: css`
    display: inline-flex;
    align-items: center;
  `,
  itemMiddle: css`
    height: 28px;
    padding-inline: 8px;
  `,
  itemSmall: css`
    height: 24px;
    padding-inline: 6px;
  `,
  itemOutlined: css`
    border-radius: 0;

    & + & {
      border-inline-start: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
  root: css`
    display: inline-flex;
    align-items: center;
  `,
  rootBorderless: css`
    gap: 2px;
  `,
  rootOutlined: css`
    overflow: hidden;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadius};
  `,
}));

export const rootVariants = cva(styles.root, {
  defaultVariants: { variant: 'outlined' },
  variants: {
    variant: {
      borderless: styles.rootBorderless,
      outlined: styles.rootOutlined,
    },
  },
});

export const itemVariants = cva(styles.item, {
  defaultVariants: { size: 'middle', variant: 'outlined' },
  variants: {
    size: {
      middle: styles.itemMiddle,
      small: styles.itemSmall,
    },
    variant: {
      borderless: null,
      outlined: styles.itemOutlined,
    },
  },
});
