import { createStyles, css, cx } from 'antd-style';

// Layout constants
const LAYOUT = {
  offset: 16,
  toggleLength: 40,
  toggleShort: 16,
};

export const useStyles = createStyles(
  (
    { prefixCls, token, stylish },
    {
      headerHeight,
      showBorder,
      showHandleWideArea,
    }: { headerHeight: number; showBorder: boolean; showHandleWideArea: boolean },
  ) => {
    const prefix = `${prefixCls}-draggable-panel`;

    // Base styles
    const borderStyles = {
      borderBottom: css`
        border-block-end-width: ${showBorder ? '1px' : '0'};
      `,
      borderLeft: css`
        border-inline-start-width: ${showBorder ? '1px' : '0'};
      `,
      borderRight: css`
        border-inline-end-width: ${showBorder ? '1px' : '0'};
      `,
      borderTop: css`
        border-block-start-width: ${showBorder ? '1px' : '0'};
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
          inset-block: ${headerHeight}px 0;
          inset-inline-start: 0;
          height: calc(100% - ${headerHeight}px);
        `,
      ),
      rightFloat: cx(
        float,
        css`
          inset-block: ${headerHeight}px 0;
          inset-inline-end: 0;
          height: calc(100% - ${headerHeight}px);
        `,
      ),
      topFloat: cx(
        float,
        css`
          inset-block-start: ${headerHeight}px;
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
        z-index: 50;
        transition: all 0.2s ${token.motionEaseOut};
      }
    `;

    const handleHighlightStyle = css`
      &:hover {
        &::before {
          background: ${token.colorPrimary};
          box-shadow: 0 0 8px ${token.colorPrimary}40;
        }
      }

      &:active {
        &::before {
          background: ${token.colorPrimary} !important;
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

    // Toggle styles
    const toggleBaseStyle = cx(
      `${prefix}-toggle`,
      css`
        pointer-events: ${showHandleWideArea ? 'all' : 'none'};

        position: absolute;
        z-index: 10;

        opacity: 0;

        transition: all 0.2s ${token.motionEaseOut};

        &:hover,
        &:active {
          opacity: 1 !important;
        }

        > div {
          ${stylish.variantFilled};
          pointer-events: all;
          cursor: pointer;

          position: absolute;

          color: ${token.colorTextTertiary};

          transition: all 0.2s ${token.motionEaseOut};

          &:hover {
            color: ${token.colorTextSecondary};
          }

          &:active {
            color: ${token.colorText};
          }
        }
      `,
    );

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
            margin-inline-start: -20px;
            border-radius: 0 0 4px 4px;
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
            margin-block-start: -20px;
            border-radius: 4px 0 0 4px;
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
            margin-block-start: -20px;
            border-radius: 0 4px 4px 0;
          }
        `,
      ),
      toggleRoot: toggleBaseStyle,
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
            margin-inline-start: -20px;
            border-radius: 4px 4px 0 0;
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
        inset-block: ${headerHeight}px 0;
        inset-inline: 0;

        width: 100%;
        height: calc(100% - ${headerHeight}px);

        background: ${token.colorBgContainerSecondary};
      `,
      handlerIcon: css`
        transition: all 0.2s ${token.motionEaseOut};
      `,
      panel: cx(
        `${prefix}-fixed`,
        css`
          overflow: hidden;
          transition: all 0.2s ${token.motionEaseOut};
        `,
      ),
      root: cx(
        prefix,
        css`
          flex-shrink: 0;
          border: 0 solid ${token.colorBorderSecondary};

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
  },
);
