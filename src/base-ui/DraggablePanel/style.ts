import { createStaticStyles, cx } from 'antd-style';
import { cva } from 'class-variance-authority';

const TOGGLE_HIT_SHORT = 26;
const TOGGLE_HIT_LONG = 34;

export const BOW = {
  bulge: 10,
  curve: 0.44,
  gap: 45,
  half: 46,
  stroke: 1.25,
};

const prefix = 'base-draggable-panel';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const float = css`
    position: absolute;
    z-index: 200;
  `;

  const toggleRoot = cx(
    `${prefix}-toggle`,
    css`
      pointer-events: none;

      position: absolute;
      z-index: 110;

      display: flex;
      align-items: center;
      justify-content: center;

      > button {
        pointer-events: all;
        cursor: pointer;

        position: relative;

        width: ${TOGGLE_HIT_SHORT}px;
        height: ${TOGGLE_HIT_LONG}px;
        padding: 0;
        border: none;

        color: ${cssVar.colorTextTertiary};

        background: none;

        &:hover {
          color: ${cssVar.colorText};
        }

        &:focus-visible {
          outline: 2px solid ${cssVar.colorPrimary};
          outline-offset: 3px;
        }
      }

      svg {
        pointer-events: none;

        position: absolute;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        transform: translate(-50%, -50%) scaleX(0.45);

        overflow: visible;

        opacity: 0;

        transition:
          opacity 0.18s ${cssVar.motionEaseOut},
          transform 0.24s ${cssVar.motionEaseOut};
      }

      path {
        transition: stroke 0.16s ${cssVar.motionEaseOut};
      }

      /* The bow is the seam bending, so it carries the seam's color, not the chevron's. */
      path[data-bow] {
        stroke: ${cssVar.colorBorderSecondary};
      }

      button:hover path[data-bow] {
        stroke: ${cssVar.colorBorder};
      }
    `,
  );

  return {
    body: css`
      overflow: hidden auto;
      padding: 16px;
    `,
    bottomFloat: cx(
      float,
      css`
        inset-block-end: 0;
        inset-inline: 0;
        width: 100%;
      `,
    ),
    container: css`
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `,
    content: cx(
      `${prefix}-content`,
      css`
        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        min-width: 0;
        min-height: 0;

        background: var(--draggable-panel-bg, ${cssVar.colorBgLayout});
      `,
    ),
    fixed: css`
      position: relative;
    `,
    footer: css`
      display: flex;
      flex: none;
      gap: 8px;
      align-items: center;

      padding-block: 8px;
      padding-inline: 16px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    `,
    handle: cx(
      `${prefix}-handle`,
      css`
        touch-action: none;
        position: absolute;
        z-index: 100;

        &::before,
        &::after {
          content: '';
          position: absolute;
          background: ${cssVar.colorBorderSecondary};
          transition:
            width 0.25s ${cssVar.motionEaseOut},
            height 0.25s ${cssVar.motionEaseOut},
            background 0.16s ${cssVar.motionEaseOut};
        }

        &:hover::before,
        &:hover::after {
          background: ${cssVar.colorFill};
        }

        &[data-resizing]::before,
        &[data-resizing]::after {
          background: ${cssVar.colorPrimary};
        }

        &[data-border='false']::before,
        &[data-border='false']::after {
          background: transparent;
        }

        &:focus-visible {
          outline: 2px solid ${cssVar.colorPrimary};
          outline-offset: -2px;
        }
      `,
    ),
    handleHorizontal: css`
      cursor: row-resize;
      inset-inline: 0;
      height: var(--draggable-panel-handle-size);

      &::before,
      &::after {
        inset-block-start: 50%;
        height: 1px;
        margin-block-start: -0.5px;
      }

      &::before {
        inset-inline-start: 0;
        width: calc(50% - var(--draggable-panel-gap, 0px));
      }

      &::after {
        inset-inline-end: 0;
        width: calc(50% - var(--draggable-panel-gap, 0px));
      }
    `,
    handleVertical: css`
      cursor: col-resize;
      inset-block: 0;
      width: var(--draggable-panel-handle-size);

      &::before,
      &::after {
        inset-inline-start: 50%;
        width: 1px;
        margin-inline-start: -0.5px;
      }

      &::before {
        inset-block-start: 0;
        height: calc(50% - var(--draggable-panel-gap, 0px));
      }

      &::after {
        inset-block-end: 0;
        height: calc(50% - var(--draggable-panel-gap, 0px));
      }
    `,
    header: css`
      display: flex;
      flex: none;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      padding-block: 8px;
      padding-inline: 16px;
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};

      font-weight: 500;
    `,
    leftFloat: cx(
      float,
      css`
        inset-block: 0;
        inset-inline-start: 0;
        height: 100%;
      `,
    ),
    rightFloat: cx(
      float,
      css`
        inset-block: 0;
        inset-inline-end: 0;
        height: 100%;
      `,
    ),
    root: cx(
      prefix,
      css`
        --draggable-panel-gap: 0px;

        display: flex;
        flex-shrink: 0;
        min-width: 0;
        min-height: 0;

        &[data-expandable='true']:hover,
        &[data-expandable='true']:focus-within,
        &[data-expandable='true'][data-expand='false'] {
          --draggable-panel-gap: ${BOW.gap}px;
        }

        /* The wrapper carries an inline opacity when collapsed, so beat it. */
        &[data-expandable='true']:hover
          .${prefix}-toggle,
          &[data-expandable='true']:focus-within
          .${prefix}-toggle {
          opacity: 1 !important;
        }

        &[data-expandable='true']:hover .${prefix}-toggle svg,
        &[data-expandable='true']:focus-within .${prefix}-toggle svg,
        &[data-expandable='true'][data-expand='false'] .${prefix}-toggle svg {
          transform: translate(-50%, -50%) scaleX(1);
          opacity: 1;
        }

        &[data-expandable='true'][data-resizing='true'] {
          --draggable-panel-gap: 0px;
        }

        &[data-expandable='true'][data-resizing='true'] .${prefix}-toggle svg {
          opacity: 0;
        }
      `,
    ),
    toggleBottom: cx(
      `${prefix}-toggle-bottom`,
      css`
        inset-block-end: -${TOGGLE_HIT_SHORT / 2}px;
        inset-inline: 0;
        height: ${TOGGLE_HIT_SHORT}px;

        > button {
          width: ${TOGGLE_HIT_LONG}px;
          height: ${TOGGLE_HIT_SHORT}px;
        }
      `,
    ),
    toggleLeft: cx(
      `${prefix}-toggle-left`,
      css`
        inset-block: 0;
        inset-inline-start: -${TOGGLE_HIT_SHORT / 2}px;
        width: ${TOGGLE_HIT_SHORT}px;
      `,
    ),
    toggleRight: cx(
      `${prefix}-toggle-right`,
      css`
        inset-block: 0;
        inset-inline-end: -${TOGGLE_HIT_SHORT / 2}px;
        width: ${TOGGLE_HIT_SHORT}px;
      `,
    ),
    toggleRoot,
    toggleTop: cx(
      `${prefix}-toggle-top`,
      css`
        inset-block-start: -${TOGGLE_HIT_SHORT / 2}px;
        inset-inline: 0;
        height: ${TOGGLE_HIT_SHORT}px;

        > button {
          width: ${TOGGLE_HIT_LONG}px;
          height: ${TOGGLE_HIT_SHORT}px;
        }
      `,
    ),

    topFloat: cx(
      float,
      css`
        inset-block-start: 0;
        inset-inline: 0;
        width: 100%;
      `,
    ),
  };
});

export const rootVariants = cva(styles.root, {
  compoundVariants: [
    { class: styles.leftFloat, mode: 'float', placement: 'left' },
    { class: styles.rightFloat, mode: 'float', placement: 'right' },
    { class: styles.topFloat, mode: 'float', placement: 'top' },
    { class: styles.bottomFloat, mode: 'float', placement: 'bottom' },
  ],
  defaultVariants: { mode: 'fixed', placement: 'right' },
  variants: {
    mode: { fixed: styles.fixed, float: null },
    placement: { bottom: null, left: null, right: null, top: null },
  },
});

export const handleVariants = cva(styles.handle, {
  variants: {
    edge: {
      bottom: styles.handleHorizontal,
      left: styles.handleVertical,
      right: styles.handleVertical,
      top: styles.handleHorizontal,
    },
  },
});

export const toggleVariants = cva(styles.toggleRoot, {
  variants: {
    placement: {
      bottom: styles.toggleTop,
      left: styles.toggleRight,
      right: styles.toggleLeft,
      top: styles.toggleBottom,
    },
  },
});
