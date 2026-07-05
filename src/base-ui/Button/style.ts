import { createStaticStyles } from 'antd-style';

import { controlHeight } from '@/base-ui/controlSize';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  base: css`
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    border: 1px solid ${cssVar.colorBorder};

    font-weight: 500;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;

    transition:
      color 160ms cubic-bezier(0.32, 0.72, 0, 1),
      background 160ms cubic-bezier(0.32, 0.72, 0, 1),
      border-color 160ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 160ms cubic-bezier(0.32, 0.72, 0, 1);

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }

    &:disabled,
    &[aria-disabled='true'] {
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,

  sizeSmall: css`
    height: ${controlHeight.small}px;
    padding-inline: 8px;
    border-radius: ${cssVar.borderRadiusSM};
    font-size: 12px;
  `,

  sizeMiddle: css`
    height: ${controlHeight.middle}px;
    padding-inline: 14px;
    border-radius: ${cssVar.borderRadiusSM};
    font-size: 13px;
  `,

  sizeLarge: css`
    height: ${controlHeight.large}px;
    padding-inline: 16px;
    border-radius: ${cssVar.borderRadius};
    font-size: 14px;
  `,

  shapeCircle: css`
    padding-inline: 0;
    border-radius: 50%;
  `,

  shapeRound: css`
    border-radius: 999px;
  `,

  block: css`
    width: 100%;
  `,

  iconEnd: css`
    flex-direction: row-reverse;
  `,

  iconOnlySmall: css`
    width: 24px;
    padding-inline: 0;
  `,

  iconOnlyMiddle: css`
    width: 32px;
    padding-inline: 0;
  `,

  iconOnlyLarge: css`
    width: 40px;
    padding-inline: 0;
  `,

  iconBox: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,

  spinnerSlot: css`
    overflow: hidden;

    width: 0;
    margin-inline-end: -6px;

    opacity: 0;

    transition:
      width 380ms cubic-bezier(0.22, 1, 0.36, 1),
      margin 380ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
  `,

  spinnerSlotEnd: css`
    margin-inline: -6px 0;
  `,

  spinnerSlotShow: css`
    width: 12px;
    margin-inline: 0;
    opacity: 1;
  `,

  variantDefault: css`
    color: ${cssVar.colorText};
    background: ${cssVar.colorBgContainer};

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorPrimaryBorder};
      color: ${cssVar.colorPrimaryText};
    }
  `,

  variantPrimary: css`
    border-color: ${cssVar.colorPrimary};
    color: ${cssVar.colorBgLayout};
    background: ${cssVar.colorPrimary};

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorPrimaryHover};
      background: ${cssVar.colorPrimaryHover};
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorPrimaryActive};
      background: ${cssVar.colorPrimaryActive};
    }
  `,

  variantDashed: css`
    border-style: dashed;
    color: ${cssVar.colorText};
    background: ${cssVar.colorBgContainer};

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorPrimaryBorder};
      color: ${cssVar.colorPrimaryText};
    }
  `,

  variantFill: css`
    border-color: transparent;
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillTertiary};

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: ${cssVar.colorFillSecondary};
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      background: ${cssVar.colorFill};
    }
  `,

  variantText: css`
    border-color: transparent;
    color: ${cssVar.colorText};
    background: transparent;

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: ${cssVar.colorFillSecondary};
    }
  `,

  variantLink: css`
    padding-inline: 0;
    border-color: transparent;
    color: ${cssVar.colorPrimary};
    background: transparent;

    &:hover:not(:disabled, [aria-disabled='true']) {
      color: ${cssVar.colorPrimaryHover};
      background: transparent;
    }
  `,

  dangerOutlined: css`
    border-color: ${cssVar.colorError};
    color: ${cssVar.colorError};
    background: ${cssVar.colorBgContainer};

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorErrorHover};
      color: ${cssVar.colorErrorHover};
      background: ${cssVar.colorBgContainer};
    }
  `,

  dangerSolid: css`
    border-color: ${cssVar.colorError};
    color: ${cssVar.colorBgLayout};
    background: ${cssVar.colorError};

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorErrorHover};
      background: ${cssVar.colorErrorHover};
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorErrorActive};
      background: ${cssVar.colorErrorActive};
    }
  `,

  dangerFill: css`
    border-color: transparent;
    color: ${cssVar.colorError};
    background: ${cssVar.colorErrorBg};

    &:hover:not(:disabled, [aria-disabled='true']) {
      color: ${cssVar.colorErrorHover};
      background: ${cssVar.colorErrorBgHover};
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      color: ${cssVar.colorErrorActive};
      background: ${cssVar.colorErrorBgHover};
    }
  `,

  dangerInline: css`
    color: ${cssVar.colorError};

    &:hover:not(:disabled, [aria-disabled='true']) {
      color: ${cssVar.colorErrorHover};
    }
  `,

  ghostDefault: css`
    border-color: rgb(255 255 255 / 65%);
    color: #fff;
    background: transparent;

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: #fff;
      background: color-mix(in srgb, currentcolor 8%, transparent);
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      background: color-mix(in srgb, currentcolor 14%, transparent);
    }
  `,

  ghostDashed: css`
    border-style: dashed;
  `,

  ghostPrimary: css`
    border-color: ${cssVar.colorPrimary};
    color: ${cssVar.colorPrimary};
    background: transparent;

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorPrimaryHover};
      color: ${cssVar.colorPrimaryHover};
      background: color-mix(in srgb, currentcolor 8%, transparent);
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      background: color-mix(in srgb, currentcolor 14%, transparent);
    }
  `,

  ghostDanger: css`
    border-color: ${cssVar.colorError};
    color: ${cssVar.colorError};
    background: transparent;

    &:hover:not(:disabled, [aria-disabled='true']) {
      border-color: ${cssVar.colorErrorHover};
      color: ${cssVar.colorErrorHover};
      background: color-mix(in srgb, currentcolor 8%, transparent);
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      background: color-mix(in srgb, currentcolor 14%, transparent);
    }
  `,

  spinner: css`
    @keyframes base-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    display: inline-block;

    width: 12px;
    height: 12px;
    border: 1.5px solid currentcolor;
    border-block-start-color: transparent;
    border-radius: 50%;

    animation: base-button-spin 0.6s linear infinite;
  `,
}));
