import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    overflow: hidden auto;
    flex: 1;
    min-height: 0;
    padding: 0;
  `,
  close: css`
    position: static;

    width: 32px;
    height: 32px;
    margin-inline-end: -4px;
    border-radius: 8px;
  `,
  actions: css`
    display: flex;
    flex: none;
    gap: 4px;
    align-items: center;
  `,
  footer: css`
    flex: none;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  header: css`
    flex: none;
    min-height: 48px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  headerActions: css`
    display: flex;
    flex: none;
    gap: 4px;
    align-items: center;
  `,
  panel: css`
    transform-origin: 100% 100%;

    width: calc(100dvw - 32px);
    max-height: calc(100dvh - 32px);
    border-radius: 12px;

    box-shadow:
      0 6px 24px 0 rgb(0 0 0 / 8%),
      0 2px 6px 0 rgb(0 0 0 / 4%);
  `,
  panelTop: css`
    transform-origin: 100% 0;
  `,
  resizeHandle: css`
    touch-action: none;
    position: absolute;
    z-index: 1;
    background: transparent;

    &::after {
      content: '';

      position: absolute;

      border-radius: 999px;

      opacity: 0;
      background: ${cssVar.colorPrimary};

      transition: opacity 120ms ease;
    }

    &:hover::after,
    &:focus-visible::after {
      opacity: 0.55;
    }
  `,
  resizeHandleBottom: css`
    cursor: ns-resize;
    inset-block-end: -4px;
    inset-inline: 16px;
    height: 8px;

    &::after {
      inset-block-end: 3px;
      inset-inline: 0;
      height: 2px;
    }
  `,
  resizeHandleBottomLeft: css`
    cursor: nesw-resize;

    inset-block-end: -5px;
    inset-inline-start: -5px;

    width: 16px;
    height: 16px;
  `,
  resizeHandleBottomRight: css`
    cursor: nwse-resize;

    inset-block-end: -5px;
    inset-inline-end: -5px;

    width: 16px;
    height: 16px;
  `,
  resizeHandleLeft: css`
    cursor: ew-resize;
    inset-block: 16px;
    inset-inline-start: -4px;
    width: 8px;

    &::after {
      inset-block: 0;
      inset-inline-start: 3px;
      width: 2px;
    }
  `,
  resizeHandleRight: css`
    cursor: ew-resize;
    inset-block: 16px;
    inset-inline-end: -4px;
    width: 8px;

    &::after {
      inset-block: 0;
      inset-inline-end: 3px;
      width: 2px;
    }
  `,
  resizeHandleTop: css`
    cursor: ns-resize;
    inset-block-start: -4px;
    inset-inline: 16px;
    height: 8px;

    &::after {
      inset-block-start: 3px;
      inset-inline: 0;
      height: 2px;
    }
  `,
  resizeHandleTopLeft: css`
    cursor: nwse-resize;

    inset-block-start: -5px;
    inset-inline-start: -5px;

    width: 16px;
    height: 16px;
  `,
  resizeHandleTopRight: css`
    cursor: nesw-resize;

    inset-block-start: -5px;
    inset-inline-end: -5px;

    width: 16px;
    height: 16px;
  `,
  title: css`
    overflow: hidden;
    flex: 1;

    min-width: 0;

    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  wrapper: css`
    overflow: hidden;
  `,
}));
