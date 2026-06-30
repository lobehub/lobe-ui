import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  indicator: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;
    inset-block-start: var(--active-item-top);
    inset-inline-start: var(--active-item-left);

    width: var(--active-item-width);
    height: var(--active-item-height);
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgLayout};
    box-shadow: ${cssVar.boxShadowTertiary};

    transition-timing-function: ${cssVar.motionEaseOut};
    transition-duration: 240ms;
    transition-property: inset-inline-start, inset-block-start, width, height;

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  item: css`
    cursor: pointer;
    user-select: none;

    position: relative;
    z-index: 1;

    display: inline-flex;
    flex-shrink: 0;
    gap: 6px;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    border: 0;

    font-weight: 500;
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;

    background: transparent;
    outline: none;

    transition:
      color 120ms ${cssVar.motionEaseOut},
      transform 120ms ${cssVar.motionEaseOut};

    &:hover:not([data-disabled], [data-pressed]) {
      color: ${cssVar.colorText};
    }

    &:active:not([data-disabled]) {
      transform: scale(0.98);
    }

    &:focus-visible {
      border-radius: ${cssVar.borderRadius};
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: -2px;
    }

    &[data-pressed] {
      color: ${cssVar.colorText};
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  itemBlock: css`
    flex: 1 1 0;
  `,
  itemIcon: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
  itemLabel: css`
    display: inline-flex;
    align-items: center;
  `,
  itemLarge: css`
    height: 36px;
    padding-inline: 16px;
    border-radius: ${cssVar.borderRadius};
    font-size: 14px;
  `,
  itemMiddle: css`
    height: 32px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};
    font-size: 13px;
  `,
  itemSmall: css`
    height: 26px;
    padding-inline: 10px;
    border-radius: ${cssVar.borderRadius};
    font-size: 12px;
  `,
  list: css`
    position: relative;

    display: inline-flex;
    flex-wrap: nowrap;
    gap: 4px;
    align-items: center;
    align-self: flex-start;

    box-sizing: border-box;
    padding: 3px;
    border-radius: ${cssVar.borderRadiusLG};

    &[data-orientation='vertical'] {
      flex-direction: column;
      align-items: stretch;
      align-self: stretch;
    }
  `,
  listBlock: css`
    display: flex;
    align-self: stretch;
    width: 100%;
  `,
  listFilled: css`
    border: 1px solid ${cssVar.colorFillQuaternary};
    background: ${cssVar.colorFillTertiary};
  `,
  listGlass: lobeStaticStylish.blur,
  listOutlined: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    background: transparent;
  `,
  listShadow: lobeStaticStylish.shadow,
  root: css`
    display: inline-flex;

    &[data-block='true'] {
      display: flex;
      width: 100%;
    }
  `,
}));

export const listVariants = cva(styles.list, {
  defaultVariants: {
    block: false,
    glass: false,
    shadow: false,
    variant: 'filled',
  },
  variants: {
    block: {
      false: null,
      true: styles.listBlock,
    },
    glass: {
      false: null,
      true: styles.listGlass,
    },
    shadow: {
      false: null,
      true: styles.listShadow,
    },
    variant: {
      filled: styles.listFilled,
      outlined: styles.listOutlined,
    },
  },
});

export const itemVariants = cva(styles.item, {
  defaultVariants: {
    block: false,
    size: 'middle',
  },
  variants: {
    block: {
      false: null,
      true: styles.itemBlock,
    },
    size: {
      large: styles.itemLarge,
      middle: styles.itemMiddle,
      small: styles.itemSmall,
    },
  },
});
