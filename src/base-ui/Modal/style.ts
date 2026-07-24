import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  backdrop: css`
    position: fixed;
    z-index: 1200;
    inset: 0;

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent);

    transition: opacity 180ms cubic-bezier(0.32, 0.72, 0, 1);

    &[data-starting-style],
    &[data-ending-style] {
      opacity: 0;
    }
  `,

  close: css`
    cursor: pointer;

    position: absolute;
    inset-block-start: 12px;
    inset-inline-end: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 12px;

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 160ms cubic-bezier(0.32, 0.72, 0, 1);

    &:hover {
      transform: scale(1.04);
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }
  `,

  closeInline: css`
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 12px;

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 160ms cubic-bezier(0.32, 0.72, 0, 1);

    &:hover {
      transform: scale(1.04);
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }
  `,

  content: css`
    overflow: hidden auto;
    padding-block: 12px;
    padding-inline: 16px;
  `,

  footer: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;

    padding-block: 12px;
    padding-inline: 16px;
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    min-height: 56px;
    padding-block: 12px;
    padding-inline: 16px;
  `,

  headerDraggable: css`
    cursor: default;
    user-select: none;
  `,

  popup: css`
    pointer-events: none;

    position: fixed;
    z-index: 1201;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  `,

  popupInner: css`
    pointer-events: auto;

    position: relative;

    overflow: hidden;
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    width: calc(100% - 32px);
    max-width: 520px;
    max-height: calc(100dvh - 64px);
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadow};

    transition:
      transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
      opacity 220ms cubic-bezier(0.32, 0.72, 0, 1);

    &[data-starting-style] {
      transform: scale(0.97);
      opacity: 0;
    }

    &[data-ending-style] {
      transform: scale(0.98);
      opacity: 0;
      transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
      transition-duration: 120ms;
    }
  `,

  title: css`
    margin: 0;

    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    color: ${cssVar.colorText};
    letter-spacing: -0.005em;
  `,

  loadingSpinner: css`
    @keyframes modal-spin {
      to {
        transform: rotate(360deg);
      }
    }

    display: inline-block;

    width: 14px;
    height: 14px;
    border: 2px solid currentcolor;
    border-block-start-color: transparent;
    border-radius: 50%;

    animation: modal-spin 0.6s linear infinite;
  `,

  fullscreenPopupInner: css`
    width: 100% !important;
    max-width: 100% !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    border: none;
    border-radius: 12px;
  `,

  fullscreenToggle: css`
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 12px;

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 160ms cubic-bezier(0.32, 0.72, 0, 1);

    &:hover {
      transform: scale(1.04);
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }
  `,

  headerActions: css`
    display: flex;
    gap: 4px;
    align-items: center;
    margin-inline-end: -4px;
  `,

  denyAnimation: css`
    @keyframes modal-deny {
      0%,
      100% {
        transform: translateX(0);
      }

      20% {
        transform: translateX(-5px);
      }

      40% {
        transform: translateX(5px);
      }

      60% {
        transform: translateX(-3px);
      }

      80% {
        transform: translateX(2px);
      }
    }

    animation: modal-deny 280ms cubic-bezier(0.36, 0.66, 0.04, 1);
  `,

  viewport: css`
    position: fixed;
    z-index: 1200;
    inset: 0;
    overflow: auto;
  `,
}));
