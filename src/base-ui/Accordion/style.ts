import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  action: css`
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;

    opacity: 0;

    transition: opacity 150ms ${cssVar.motionEaseOut};
  `,
  actionAlwaysVisible: css`
    opacity: 1;
  `,
  actionBorderless: css`
    padding-inline-end: var(--accordion-hover-inset, 8px);
  `,
  actionOutlined: css`
    padding-inline-end: 16px;
  `,
  content: css`
    font-size: 14px;
    line-height: 1.6;
  `,
  contentBorderless: css`
    padding-block: 0 12px;
  `,
  contentIndent: css`
    padding-inline-start: 24px;
  `,
  contentIndentOutlined: css`
    padding-inline-start: 40px;
  `,
  contentOutlined: css`
    padding-block: 0 14px;
    padding-inline: 16px;
  `,
  header: css`
    position: relative;

    display: flex;
    align-items: center;

    margin: 0;

    font-size: inherit;
    font-weight: inherit;

    transition: background 150ms ${cssVar.motionEaseOut};

    &:hover:not(:has([data-disabled])) {
      background: ${cssVar.colorFillTertiary};
    }

    &:hover .accordion-action,
    &:focus-within .accordion-action {
      opacity: 1;
    }
  `,
  headerBorderless: css`
    margin-inline: calc(var(--accordion-hover-inset, 8px) * -1);
    border-radius: ${cssVar.borderRadius};
  `,
  indicator: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;

    color: ${cssVar.colorTextDescription};

    transition: transform 200ms ${cssVar.motionEaseOut};

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  indicatorEnd: css`
    margin-inline-start: auto;

    [data-panel-open] & {
      transform: rotate(180deg);
    }
  `,
  indicatorStart: css`
    [data-panel-open] & {
      transform: rotate(90deg);
    }
  `,
  item: css`
    display: flex;
    flex-direction: column;
  `,
  itemOutlined: css`
    & + & {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
  panel: css`
    overflow: hidden;
    height: var(--accordion-panel-height);
    transition: height 200ms ${cssVar.motionEaseOut};

    &[data-starting-style],
    &[data-ending-style] {
      height: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  root: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  rootOutlined: css`
    overflow: hidden;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
  `,
  trigger: css`
    cursor: pointer;
    user-select: none;

    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;

    min-width: 0;
    border: 0;
    border-radius: inherit;

    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: ${cssVar.colorText};
    text-align: start;

    background: none;
    outline: none;

    ${focusRing};

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
    }
  `,
  triggerBorderless: css`
    padding-block: 8px;
    padding-inline: var(--accordion-hover-inset, 8px);
  `,
  triggerOutlined: css`
    padding-block: 12px;
    padding-inline: 16px;
  `,
}));

export const rootVariants = cva(styles.root, {
  defaultVariants: { variant: 'borderless' },
  variants: {
    variant: {
      borderless: null,
      outlined: styles.rootOutlined,
    },
  },
});

export const itemVariants = cva(styles.item, {
  defaultVariants: { variant: 'borderless' },
  variants: {
    variant: {
      borderless: null,
      outlined: styles.itemOutlined,
    },
  },
});

export const headerVariants = cva(styles.header, {
  defaultVariants: { variant: 'borderless' },
  variants: {
    variant: {
      borderless: styles.headerBorderless,
      outlined: null,
    },
  },
});

export const triggerVariants = cva(styles.trigger, {
  defaultVariants: { variant: 'borderless' },
  variants: {
    variant: {
      borderless: styles.triggerBorderless,
      outlined: styles.triggerOutlined,
    },
  },
});

export const indicatorVariants = cva(styles.indicator, {
  defaultVariants: { placement: 'start' },
  variants: {
    placement: {
      end: styles.indicatorEnd,
      start: styles.indicatorStart,
    },
  },
});

export const contentVariants = cva(styles.content, {
  compoundVariants: [
    {
      class: styles.contentIndent,
      indent: true,
      variant: 'borderless',
    },
    {
      class: styles.contentIndentOutlined,
      indent: true,
      variant: 'outlined',
    },
  ],
  defaultVariants: { indent: true, variant: 'borderless' },
  variants: {
    indent: {
      false: null,
      true: null,
    },
    variant: {
      borderless: styles.contentBorderless,
      outlined: styles.contentOutlined,
    },
  },
});

export const actionVariants = cva(styles.action, {
  defaultVariants: { alwaysVisible: false, variant: 'borderless' },
  variants: {
    alwaysVisible: {
      false: null,
      true: styles.actionAlwaysVisible,
    },
    variant: {
      borderless: styles.actionBorderless,
      outlined: styles.actionOutlined,
    },
  },
});
