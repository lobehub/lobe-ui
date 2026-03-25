import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  backdrop: css`
    position: fixed;
    z-index: 1000;
    inset: 0;

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent);

    transition: opacity 150ms ease-out;

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
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 150ms ease-out;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
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
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 150ms ease-out;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
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
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-block: 12px;
    padding-inline: 16px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,

  headerDraggable: css`
    cursor: default;
    user-select: none;
  `,

  popup: css`
    pointer-events: none;

    position: fixed;
    z-index: 1001;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  `,

  popupInner: css`
    pointer-events: auto;

    position: relative;

    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    width: calc(100% - 32px);
    max-width: 520px;
    max-height: calc(100dvh - 64px);
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadow};

    transition:
      transform 150ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 150ms ease-out;

    &[data-starting-style],
    &[data-ending-style] {
      transform: scale(0.96) translateY(4px);
      opacity: 0;
    }
  `,

  title: css`
    margin: 0;

    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: ${cssVar.colorText};
  `,

  buttonBase: css`
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    height: 36px;
    padding-block: 0;
    padding-inline: 16px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 14px;
    font-weight: 500;
    line-height: 1;

    transition: all 150ms ease-out;

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,

  cancelButton: css`
    color: ${cssVar.colorText};
    background: ${cssVar.colorBgContainer};

    &:hover:not(:disabled) {
      border-color: ${cssVar.colorPrimaryBorder};
      color: ${cssVar.colorPrimaryText};
    }
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

  dangerOkButton: css`
    border-color: ${cssVar.colorError};
    color: #fff;
    background: ${cssVar.colorError};

    &:hover:not(:disabled) {
      border-color: ${cssVar.colorErrorHover};
      background: ${cssVar.colorErrorHover};
    }

    &:active:not(:disabled) {
      border-color: ${cssVar.colorErrorActive};
      background: ${cssVar.colorErrorActive};
    }
  `,

  fullscreenPopupInner: css`
    width: 100% !important;
    max-width: 100% !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    border: none;
    border-radius: 0;
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
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition: all 150ms ease-out;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }
  `,

  headerActions: css`
    display: flex;
    gap: 4px;
    align-items: center;
    margin-inline-end: -4px;
  `,

  okButton: css`
    border-color: ${cssVar.colorPrimary};
    color: #fff;
    background: ${cssVar.colorPrimary};

    &:hover:not(:disabled) {
      border-color: ${cssVar.colorPrimaryHover};
      background: ${cssVar.colorPrimaryHover};
    }

    &:active:not(:disabled) {
      border-color: ${cssVar.colorPrimaryActive};
      background: ${cssVar.colorPrimaryActive};
    }
  `,

  denyAnimation: css`
    @keyframes modal-deny {
      0% {
        outline-color: ${cssVar.colorPrimary};
        outline-offset: 0;
      }

      100% {
        outline-color: transparent;
        outline-offset: 4px;
      }
    }

    outline: 2px solid transparent;
    animation: modal-deny 400ms ease-out;
  `,

  viewport: css`
    position: fixed;
    z-index: 1000;
    inset: 0;
    overflow: auto;
  `,
}));
