import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

// Layout constants
const LAYOUT = {
  offset: 16,
  toggleLength: 54,
  toggleShort: 16,
};

const prefixCls = 'ant';

const prefix = `${prefixCls}-draggable-panel`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  // Base styles - border styles split by showBorder
  const borderStyles = {
    borderBottom: css`
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    `,
    borderBottomNone: css`
      border-block-end-width: 0;
    `,
    borderLeft: css`
      border-inline-start: 1px solid ${cssVar.colorBorderSecondary};
    `,
    borderLeftNone: css`
      border-inline-start-width: 0;
    `,
    borderRight: css`
      border-inline-end: 1px solid ${cssVar.colorBorderSecondary};
    `,
    borderRightNone: css`
      border-inline-end-width: 0;
    `,
    borderTop: css`
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    `,
    borderTopNone: css`
      border-block-start-width: 0;
    `,
  };

  // Position styles
  const float = css`
    position: absolute;
    z-index: 200;
  `;

  const floatPositions = {
    bottomFloat: cx(
      float,
      css`
        inset-block-end: 0;
        inset-inline: 0 0;
        width: 100%;
      `,
    ),
    leftFloat: cx(
      float,
      css`
        inset-block: var(--draggable-panel-header-height, 0) 0;
        inset-inline-start: 0;
        height: calc(100% - var(--draggable-panel-header-height, 0px));
      `,
    ),
    rightFloat: cx(
      float,
      css`
        inset-block: var(--draggable-panel-header-height, 0) 0;
        inset-inline-end: 0;
        height: calc(100% - var(--draggable-panel-header-height, 0px));
      `,
    ),
    topFloat: cx(
      float,
      css`
        inset-block-start: var(--draggable-panel-header-height, 0);
        inset-inline: 0 0;
        width: 100%;
      `,
    ),
  };

  // Handle styles
  const handleBaseStyle = css`
    position: relative;

    &::before {
      content: '';
      position: absolute;
      transition: all 0.2s ${cssVar.motionEaseOut};
    }
  `;

  const handleHighlightStyle = css`
    &:hover {
      &::before {
        background: ${cssVar.colorPrimary};
        box-shadow: 0 0 8px color-mix(in srgb, ${cssVar.colorPrimary} 25%, transparent);
      }
    }

    &:active {
      &::before {
        background: ${cssVar.colorPrimary} !important;
      }
    }
  `;

  const handleStyles = {
    handleBottom: cx(
      `${prefix}-bottom-handle`,
      css`
        &::before {
          inset-block-end: 50%;
          width: 100%;
          height: 2px;
        }
      `,
    ),
    handleLeft: cx(
      `${prefix}-left-handle`,
      css`
        &::before {
          inset-inline-start: 50%;
          width: 2px;
          height: 100%;
        }
      `,
    ),
    handleRight: cx(
      `${prefix}-right-handle`,
      css`
        &::before {
          inset-inline-end: 50%;
          width: 2px;
          height: 100%;
        }
      `,
    ),
    handleRoot: handleBaseStyle,
    handleTop: cx(
      `${prefix}-top-handle`,
      css`
        &::before {
          inset-block-start: 50%;
          width: 100%;
          height: 2px;
        }
      `,
    ),
  };

  // Toggle styles - base class with variant for showHandleWideArea
  const toggleRoot = cx(
    `${prefix}-toggle`,
    css`
      position: absolute;
      z-index: 50;
      opacity: 0;
      transition: all 0.2s ${cssVar.motionEaseOut};

      &:hover,
      &:active {
        opacity: 1 !important;
      }

      > div {
        pointer-events: all;
        cursor: pointer;

        position: absolute;

        border: 1px solid ${cssVar.colorBorder};

        color: ${cssVar.colorTextTertiary};

        background: var(--draggable-panel-bg, ${cssVar.colorBgLayout});
        backdrop-filter: blur(8px);

        transition: all 0.2s ${cssVar.motionEaseOut};

        &:hover {
          color: ${cssVar.colorTextSecondary};
        }

        &:active {
          color: ${cssVar.colorText};
        }
      }
    `,
  );

  const toggleRootWithWideArea = css`
    pointer-events: all;
  `;

  const toggleRootWithoutWideArea = css`
    pointer-events: none;
  `;

  const toggleStyles = {
    toggleBottom: cx(
      `${prefix}-toggle-bottom`,
      css`
        inset-block-end: -${LAYOUT.offset}px;
        width: 100%;
        height: ${LAYOUT.toggleShort}px;

        > div {
          inset-inline-start: 50%;

          width: ${LAYOUT.toggleLength}px;
          height: ${LAYOUT.toggleShort}px;
          margin-inline-start: -27px;
          border-block-start-width: 0;
          border-radius: 0 0 ${cssVar.borderRadiusLG} ${cssVar.borderRadiusLG};
        }
      `,
    ),
    toggleLeft: cx(
      `${prefix}-toggle-left`,
      css`
        inset-inline-start: -${LAYOUT.offset}px;
        width: ${LAYOUT.toggleShort}px;
        height: 100%;

        > div {
          inset-block-start: 50%;

          width: ${LAYOUT.toggleShort}px;
          height: ${LAYOUT.toggleLength}px;
          margin-block-start: -27px;
          border-inline-end-width: 0;
          border-radius: ${cssVar.borderRadiusLG} 0 0 ${cssVar.borderRadiusLG};
        }
      `,
    ),
    toggleRight: cx(
      `${prefix}-toggle-right`,
      css`
        inset-inline-end: -${LAYOUT.offset}px;
        width: ${LAYOUT.toggleShort}px;
        height: 100%;

        > div {
          inset-block-start: 50%;

          width: ${LAYOUT.toggleShort}px;
          height: ${LAYOUT.toggleLength}px;
          margin-block-start: -27px;
          border-inline-start-width: 0;
          border-radius: 0 ${cssVar.borderRadiusLG} ${cssVar.borderRadiusLG} 0;
        }
      `,
    ),
    toggleRoot,
    toggleRootWithWideArea,
    toggleRootWithoutWideArea,
    toggleTop: cx(
      `${prefix}-toggle-top`,
      css`
        inset-block-start: -${LAYOUT.offset}px;
        width: 100%;
        height: ${LAYOUT.toggleShort}px;

        > div {
          inset-inline-start: 50%;

          width: ${LAYOUT.toggleLength}px;
          height: ${LAYOUT.toggleShort}px;
          margin-inline-start: -27px;
          border-block-end-width: 0;
          border-radius: ${cssVar.borderRadiusLG} ${cssVar.borderRadiusLG} 0 0;
        }
      `,
    ),
  };

  // Additional component styles
  const componentStyles = {
    fixed: css`
      position: relative;
    `,
    fullscreen: css`
      position: absolute;
      inset-block: var(--draggable-panel-header-height, 0) 0;
      inset-inline: 0;

      width: 100%;
      height: calc(100% - var(--draggable-panel-header-height, 0px));

      background: ${cssVar.colorBgContainer};
    `,
    handlerIcon: css`
      transition: all 0.2s ${cssVar.motionEaseOut};
    `,
    panel: cx(
      `${prefix}-fixed`,
      css`
        overflow: hidden;
        background: var(--draggable-panel-bg, ${cssVar.colorBgLayout});
        transition: all 0.2s ${cssVar.motionEaseOut};
      `,
    ),
    root: cx(
      prefix,
      css`
        flex-shrink: 0;

        &:hover {
          > .${prefix}-toggle {
            opacity: 1;
          }
        }
      `,
    ),
  };

  return {
    ...borderStyles,
    ...floatPositions,
    ...handleStyles,
    handleHighlight: handleHighlightStyle,
    ...toggleStyles,
    ...componentStyles,
  };
});

export const handleVariants = cva(styles.handleRoot, {
  variants: {
    placement: {
      bottom: styles.handleBottom,
      left: styles.handleLeft,
      right: styles.handleRight,
      top: styles.handleTop,
    },
  },
});

export const panelVariants = cva(styles.root, {
  compoundVariants: [
    {
      class: styles.bottomFloat,
      mode: 'float',
      placement: 'bottom',
    },
    {
      class: styles.topFloat,
      mode: 'float',
      placement: 'top',
    },
    {
      class: styles.leftFloat,
      mode: 'float',
      placement: 'left',
    },
    {
      class: styles.rightFloat,
      mode: 'float',
      placement: 'right',
    },
    // Border styles based on placement, isExpand, and showBorder
    // Note: border is on the opposite side of placement
    // placement 'top' -> borderBottom, placement 'right' -> borderLeft, etc.
    {
      class: styles.borderBottom,
      isExpand: true,
      placement: 'top',
      showBorder: true,
    },
    {
      class: styles.borderBottomNone,
      isExpand: true,
      placement: 'top',
      showBorder: false,
    },
    {
      class: styles.borderLeft,
      isExpand: true,
      placement: 'right',
      showBorder: true,
    },
    {
      class: styles.borderLeftNone,
      isExpand: true,
      placement: 'right',
      showBorder: false,
    },
    {
      class: styles.borderTop,
      isExpand: true,
      placement: 'bottom',
      showBorder: true,
    },
    {
      class: styles.borderTopNone,
      isExpand: true,
      placement: 'bottom',
      showBorder: false,
    },
    {
      class: styles.borderRight,
      isExpand: true,
      placement: 'left',
      showBorder: true,
    },
    {
      class: styles.borderRightNone,
      isExpand: true,
      placement: 'left',
      showBorder: false,
    },
  ],
  defaultVariants: {
    isExpand: false,
    mode: 'fixed',
    placement: 'right',
    showBorder: true,
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    isExpand: {
      false: null,
      true: null,
    },
    mode: {
      fixed: styles.fixed,
      float: null,
    },
    placement: {
      bottom: null,
      left: null,
      right: null,
      top: null,
    },
    showBorder: {
      false: null,
      true: null,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});

export const toggleVariants = cva(styles.toggleRoot, {
  compoundVariants: [
    {
      class: styles.toggleRootWithWideArea,
      showHandleWideArea: true,
    },
    {
      class: styles.toggleRootWithoutWideArea,
      showHandleWideArea: false,
    },
  ],
  defaultVariants: {
    showHandleWideArea: false,
  },
  variants: {
    placement: {
      bottom: styles.toggleTop,
      left: styles.toggleRight,
      right: styles.toggleLeft,
      top: styles.toggleBottom,
    },
    showHandleWideArea: {
      false: null,
      true: null,
    },
  },
});
