import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  indicator: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;

    transition-timing-function: ${cssVar.motionEaseOut};
    transition-duration: 240ms;
    transition-property: inset-inline-start, inset-block-start, width, height, transform;

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  indicatorPoint: css`
    inset-block-end: 6px;
    inset-inline-start: calc(var(--active-tab-left) + var(--active-tab-width) / 2 - 2.5px);

    width: 5px;
    height: 5px;
    border-radius: 50%;

    background: ${cssVar.colorPrimary};
  `,
  indicatorRounded: css`
    inset-block-start: var(--active-tab-top);
    inset-inline-start: var(--active-tab-left);

    width: var(--active-tab-width);
    height: var(--active-tab-height);
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadowTertiary};
  `,
  indicatorSquare: css`
    inset-block-end: 0;
    inset-inline-start: var(--active-tab-left);

    width: var(--active-tab-width);
    height: 2px;

    background: ${cssVar.colorPrimary};
  `,
  list: css`
    position: relative;

    display: inline-flex;
    flex-wrap: nowrap;
    gap: 2px;
    align-items: center;

    &[data-orientation='vertical'] {
      flex-direction: column;
      align-items: stretch;
    }
  `,
  listRounded: css`
    gap: 4px;
    align-self: flex-start;

    padding: 3px;
    border-radius: ${cssVar.borderRadiusLG};

    background: ${cssVar.colorFillTertiary};

    &[data-orientation='vertical'] {
      align-self: stretch;
    }
  `,
  listSquare: css`
    gap: 16px;
    box-shadow: inset 0 -1px 0 ${cssVar.colorBorderSecondary};

    &[data-orientation='vertical'] {
      box-shadow: inset -1px 0 0 ${cssVar.colorBorderSecondary};
    }
  `,
  panel: css`
    padding-block-start: 12px;
    outline: none;

    &:focus-visible {
      border-radius: ${cssVar.borderRadius};
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 2px;
    }
  `,
  root: css`
    display: flex;
    flex-direction: column;
    width: 100%;

    &[data-orientation='vertical'] {
      flex-direction: row;
    }
  `,
  tab: css`
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

    &:hover:not([data-disabled]) {
      color: ${cssVar.colorText};
    }

    &:active:not([data-disabled]) {
      transform: scale(0.98);
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: -2px;
    }

    &[data-active] {
      color: ${cssVar.colorPrimary};
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  tabLarge: css`
    height: 36px;
    padding-inline: 16px;
    border-radius: ${cssVar.borderRadius};
    font-size: 14px;
  `,
  tabMiddle: css`
    height: 32px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};
    font-size: 13px;
  `,
  tabPoint: css`
    height: auto;
    padding-block: 8px 14px;
  `,
  tabSmall: css`
    height: 26px;
    padding-inline: 10px;
    border-radius: ${cssVar.borderRadius};
    font-size: 12px;
  `,
  tabSquare: css`
    height: auto;
    padding-block: 8px;
    border-radius: 0;
  `,
}));

export const tabVariants = cva(styles.tab, {
  defaultVariants: {
    size: 'middle',
    variant: 'rounded',
  },
  variants: {
    size: {
      large: styles.tabLarge,
      middle: styles.tabMiddle,
      small: styles.tabSmall,
    },
    variant: {
      point: styles.tabPoint,
      rounded: null,
      square: styles.tabSquare,
    },
  },
});

export const indicatorVariants = cva(styles.indicator, {
  defaultVariants: {
    variant: 'rounded',
  },
  variants: {
    variant: {
      point: styles.indicatorPoint,
      rounded: styles.indicatorRounded,
      square: styles.indicatorSquare,
    },
  },
});

export const listVariants = cva(styles.list, {
  defaultVariants: {
    variant: 'rounded',
  },
  variants: {
    variant: {
      point: null,
      rounded: styles.listRounded,
      square: styles.listSquare,
    },
  },
});
