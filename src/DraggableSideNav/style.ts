import { createStyles } from 'antd-style';

// Layout constants (aligned with DraggablePanel)
const LAYOUT = {
  offset: 16,
  toggleLength: 40,
  toggleShort: 16,
};

export const useStyles = createStyles(({ css, token, stylish }) => ({
  body: css`
    overflow: hidden auto;
    flex: 1;
  `,
  container: css`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    /* Width transition controlled by inline style */
  `,
  contentContainer: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;

    height: 100%;
    border-inline-end: 1px solid ${token.colorBorderSecondary};

    background: ${token.colorBgContainer};
  `,
  footer: css`
    flex-shrink: 0;
    margin-block-start: auto;
    padding: 8px;
    border-block-start: 1px solid ${token.colorBorderSecondary};
  `,
  handlerIcon: css`
    transition: transform 0.2s ${token.motionEaseOut};
  `,
  header: css`
    flex-shrink: 0;
    padding: 8px;
  `,
  resizeHandle: css`
    cursor: col-resize;

    position: absolute;
    z-index: 1;
    inset-block: 0 0;

    width: 8px;

    &:hover {
      &::after {
        content: '';

        position: absolute;
        inset-block: 0;
        inset-inline-start: 50%;
        transform: translateX(-50%);

        width: 2px;

        background: ${token.colorPrimary};
      }
    }
  `,
  resizeHandleLeft: css`
    inset-inline-end: -4px;
  `,
  resizeHandleRight: css`
    inset-inline-start: -4px;
  `,
  toggleLeft: css`
    inset-inline-end: -${LAYOUT.offset}px;
    width: ${LAYOUT.toggleShort}px;
    height: 100%;

    > div {
      inset-block-start: 50%;

      width: ${LAYOUT.toggleShort}px;
      height: ${LAYOUT.toggleLength}px;
      margin-block-start: -${LAYOUT.toggleLength / 2}px;
      border-radius: 0 4px 4px 0; /* 左侧面板，handle 在右边，右侧圆角 */
    }
  `,
  toggleRight: css`
    inset-inline-start: -${LAYOUT.offset}px;
    width: ${LAYOUT.toggleShort}px;
    height: 100%;

    > div {
      inset-block-start: 50%;

      width: ${LAYOUT.toggleShort}px;
      height: ${LAYOUT.toggleLength}px;
      margin-block-start: -${LAYOUT.toggleLength / 2}px;
      border-radius: 4px 0 0 4px; /* 右侧面板，handle 在左边，左侧圆角 */
    }
  `,
  toggleRoot: css`
    pointer-events: none;
    position: absolute;

    &:has(> div) {
      pointer-events: all;
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
}));
