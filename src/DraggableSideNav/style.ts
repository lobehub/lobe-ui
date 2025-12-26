import { createStaticStyles } from 'antd-style';

// Layout constants (aligned with DraggablePanel)
const LAYOUT = {
  offset: 16,
  toggleLength: 54,
  toggleShort: 16,
};

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    /* Smooth scroll behavior */
    scroll-behavior: smooth;
    overflow: hidden auto;
    flex: 1;

    /* Better scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: ${cssVar.colorBorderSecondary};

      &:hover {
        background: ${cssVar.colorBorder};
      }
    }
  `,
  container: css`
    /* Width transition controlled by inline style */

    /* Ensure smooth animations */
    will-change: width;

    position: relative;

    display: flex;
    flex-direction: column;

    height: 100%;
  `,
  contentContainer: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;

    height: 100%;
    border-inline-end: 1px solid ${cssVar.colorBorderSecondary};

    background: var(--draggable-side-nav-bg, ${cssVar.colorBgLayout});
  `,
  contentContainerNoBorder: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;

    height: 100%;
    border-inline-end: 0 solid ${cssVar.colorBorderSecondary};

    background: var(--draggable-side-nav-bg, ${cssVar.colorBgLayout});
  `,
  footer: css`
    flex-shrink: 0;
  `,
  handlerIcon: css`
    /* Icon transitions are now handled by motion */
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  header: css`
    flex-shrink: 0;
  `,
  menuOverride: css`
    .${prefixCls}-menu {
      .${prefixCls}-menu-item {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;

        height: unset;
        min-height: 36px;
        padding-block: 4px;
        padding-inline: 8px !important;
      }

      .${prefixCls}-menu-item-group-title {
        overflow: hidden;
        padding-inline: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${prefixCls}-menu-item-icon {
        position: absolute;
        inset-inline-start: 0;

        display: flex !important;
        flex: none;
        align-items: center;
        justify-content: center;

        width: 36px;
        height: 36px;
      }

      .${prefixCls}-menu-title-content {
        overflow: hidden;
        flex: 1;

        margin: 0 !important;
        padding-inline-start: 36px;

        line-height: 1.5;
      }

      &.${prefixCls}-menu-inline-collapsed {
        .ant-menu-title-content {
          display: none;
          width: 0;
          opacity: 0;
        }

        .${prefixCls}-menu-item {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 36px !important;
          height: 36px !important;
        }
      }
    }
  `,
  resizeHandle: css`
    cursor: col-resize;

    position: absolute;
    inset-block: 0 0;

    width: 8px;

    transition: background-color 0.2s ease;

    &::after {
      content: '';

      position: absolute;
      inset-block: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);

      width: 2px;

      background: transparent;

      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
  `,
  resizeHandleHighlight: css`
    &:hover {
      &::after {
        width: 3px;
        background: ${cssVar.colorPrimary};
        box-shadow: 0 0 8px color-mix(in srgb, ${cssVar.colorPrimary} 25%, transparent);
      }
    }

    &:active {
      &::after {
        background: ${cssVar.colorPrimaryActive};
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
      margin-inline-start: -1px;
      border-inline-start-width: 0;
      border-radius: 0 ${cssVar.borderRadiusLG} ${cssVar.borderRadiusLG} 0;
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
      margin-inline-end: -1px;
      border-inline-end-width: 0;
      border-radius: ${cssVar.borderRadiusLG} 0 0 ${cssVar.borderRadiusLG}; /* 右侧面板，handle 在左边，左侧圆角 */
    }
  `,
  toggleRoot: css`
    pointer-events: none;
    position: absolute;
    z-index: 50;

    /* Smooth transitions for all states */
    transition: opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);

    &:has(> div) {
      pointer-events: all;
    }

    > div {
      pointer-events: all;
      cursor: pointer;

      position: absolute;

      border: 1px solid ${cssVar.colorBorder};

      color: ${cssVar.colorTextTertiary};

      background: var(--draggable-side-nav-bg, ${cssVar.colorBgLayout});
      backdrop-filter: blur(8px);

      /* Enhanced transitions with backdrop blur */
      transition:
        color 0.2s ${cssVar.motionEaseOut},
        transform 0.2s ${cssVar.motionEaseOut},
        box-shadow 0.2s ${cssVar.motionEaseOut};

      &:hover {
        color: ${cssVar.colorTextSecondary};
      }

      &:active {
        transform: scale(0.95);
        color: ${cssVar.colorText};
      }
    }
  `,
}));
