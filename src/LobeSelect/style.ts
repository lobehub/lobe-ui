import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  arrow: css`
    display: flex;
    width: 12px;
    height: 6px;

    & > svg {
      width: 100%;
      height: 100%;
    }
  `,
  borderless: lobeStaticStylish.variantBorderless,
  clear: css`
    display: inline-flex;
    align-items: center;

    color: ${cssVar.colorTextTertiary};

    opacity: 0;

    transition: opacity 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorTextSecondary};
    }
  `,
  empty: css``,
  filled: lobeStaticStylish.variantFilled,
  group: css``,
  groupLabel: css``,
  icon: css`
    display: inline-flex;
    align-items: center;
    transition: transform 150ms ${cssVar.motionEaseOut};

    &[data-popup-open] {
      transform: rotate(180deg);
    }
  `,
  item: css``,
  itemIndicator: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    margin-inline-start: auto;
    padding-inline-start: 8px;

    color: ${cssVar.colorPrimary};
  `,
  itemText: css``,
  list: css`
    overflow-y: auto;
    max-height: var(--available-height);
    padding-block: 0;
  `,
  outlined: lobeStaticStylish.variantOutlined,
  popup: css`
    transform-origin: var(--transform-origin);
    box-sizing: border-box;
    transition:
      opacity 150ms ${cssVar.motionEaseOut},
      transform 150ms ${cssVar.motionEaseOut};

    &[data-starting-style],
    &[data-ending-style] {
      transform: scale(0.98);
      opacity: 0;
    }
  `,
  positioner: css`
    z-index: 1100;
    outline: none;
  `,
  prefix: css`
    display: inline-flex;
    align-items: center;
    color: ${cssVar.colorTextSecondary};
  `,
  scrollArrow: css`
    cursor: default;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 16px;

    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorBgElevated};
  `,
  search: css`
    cursor: text;

    display: flex;
    align-items: center;

    min-height: 36px;
    margin-inline: -4px;
    padding-block: 8px;
    padding-inline: 12px;
    border-block-end: 1px solid ${cssVar.colorFillSecondary};
  `,
  searchInput: css`
    flex: 1;

    min-width: 0;
    padding-block: 0;
    padding-inline: 4px;
    border: 0;

    font-size: 14px;
    line-height: 20px;
    color: ${cssVar.colorText};

    background: transparent;
    outline: none;

    &::placeholder {
      color: ${cssVar.colorTextPlaceholder};
    }
  `,
  shadow: lobeStaticStylish.shadow,
  suffix: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: ${cssVar.colorTextSecondary};
  `,
  tag: css`
    display: inline-flex;
    align-items: center;

    max-width: 100%;
    padding-block: 0;
    padding-inline: 6px;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 12px;
    line-height: 20px;
    color: ${cssVar.colorText};

    background: ${cssVar.colorFillTertiary};
  `,
  tags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
  `,
  trigger: css`
    cursor: pointer;
    user-select: none;

    display: inline-flex;
    gap: 8px;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    border: 1px solid transparent;
    border-radius: ${cssVar.borderRadius};

    font-family: inherit;
    color: ${cssVar.colorText};

    background: transparent;
    outline: none;

    transition: all 150ms ${cssVar.motionEaseOut};

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &:hover [data-role='lobe-select-clear'] {
      opacity: 1;
    }

    &[data-placeholder] [data-role='lobe-select-clear'] {
      pointer-events: none;
      opacity: 0;
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
      opacity: 0.6;
    }

    &[data-disabled] [data-role='lobe-select-clear'] {
      pointer-events: none;
      opacity: 0;
    }
  `,
  triggerLarge: css`
    min-height: 40px;
    padding-block: 6px;
    padding-inline: 12px;

    font-size: 16px;
    line-height: 24px;
  `,
  triggerMiddle: css`
    min-height: 32px;
    padding-block: 4px;
    padding-inline: 11px;

    font-size: 14px;
    line-height: 20px;
  `,
  triggerSmall: css`
    min-height: 24px;
    padding-block: 0;
    padding-inline: 8px;

    font-size: 12px;
    line-height: 18px;
  `,
  value: css`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;

    min-width: 0;

    color: inherit;

    &[data-placeholder] {
      color: ${cssVar.colorTextPlaceholder};
    }
  `,
  valueText: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));

export const triggerVariants = cva(styles.trigger, {
  defaultVariants: {
    shadow: false,
    size: 'middle',
    variant: 'outlined',
  },
  variants: {
    shadow: {
      false: null,
      true: styles.shadow,
    },
    size: {
      large: styles.triggerLarge,
      middle: styles.triggerMiddle,
      small: styles.triggerSmall,
    },
    variant: {
      borderless: styles.borderless,
      filled: styles.filled,
      outlined: styles.outlined,
    },
  },
});
