import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  danger: css`
    --lobe-menu-icon-color: ${cssVar.colorError};

    color: ${cssVar.colorError} !important;

    &:hover {
      background: ${cssVar.colorErrorBg} !important;
    }
  `,

  empty: css`
    cursor: default;
    font-style: italic;
    color: ${cssVar.colorTextTertiary};
  `,

  extra: css`
    margin-inline-start: auto;
    padding-inline-start: 16px;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
  `,

  footer: css`
    flex-shrink: 0;
    padding-block: 8px;
    padding-inline: 12px;
    border-block-start: 1px solid ${cssVar.colorBorder};
  `,

  header: css`
    flex-shrink: 0;
    padding-block: 8px;
    padding-inline: 12px;
    border-block-end: 1px solid ${cssVar.colorBorder};
  `,

  groupLabel: css`
    user-select: none;

    padding-block: 4px 2px;
    padding-inline: 12px;

    font-size: 11px;
    font-weight: 500;
    line-height: 14px;
    color: ${cssVar.colorTextTertiary};
    text-transform: capitalize;
  `,

  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 14px;
    height: 14px;
    margin-inline-end: 12px;

    color: var(--lobe-menu-icon-color, ${cssVar.colorTextSecondary});

    & svg {
      width: 100%;
      height: 100%;
    }
  `,

  item: css`
    user-select: none;

    position: relative;

    overflow: hidden;
    display: flex;
    align-items: center;

    width: 100%;
    min-height: 32px;
    padding-block: 6px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 14px;
    line-height: 20px;
    color: ${cssVar.colorText};

    outline: none;

    transition: all 150ms ${cssVar.motionEaseOut};

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    &:active {
      background: ${cssVar.colorFillSecondary};
    }

    &[data-disabled] {
      cursor: not-allowed;
      color: ${cssVar.colorTextDisabled};
      opacity: 0.5;

      &:hover {
        background: transparent;
      }
    }

    &[data-highlighted]:not([data-disabled]) {
      background: ${cssVar.colorFillTertiary};
    }

    &[data-state='open']:not([data-disabled]),
    &[data-open]:not([data-disabled]),
    &[aria-expanded='true']:not([data-disabled]) {
      background: ${cssVar.colorFillTertiary};
    }
  `,

  itemContent: css`
    display: flex;
    flex: 1;
    gap: 0;
    align-items: center;
  `,

  itemContentAlignStart: css`
    align-items: flex-start;
  `,

  iconAlignStart: css`
    align-self: flex-start;
    margin-block-start: 2px;
  `,

  label: css`
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;

    & a,
    & a:visited,
    & a:hover,
    & a:active {
      color: inherit;
    }
  `,

  labelGroup: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;

    min-width: 0;
  `,

  desc: css`
    overflow: hidden;

    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextTertiary};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  popup: css`
    min-width: 220px;
    padding: 4px;
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgElevated};
    outline: none;
    box-shadow:
      0 0 0 1px ${cssVar.colorBorder},
      0 4px 12px 0 rgb(0 0 0 / 8%),
      0 1px 3px 0 rgb(0 0 0 / 6%);

    &[data-has-header] {
      padding-block-start: 0;
    }

    &[data-has-footer] {
      padding-block-end: 0;
    }
  `,

  popupWithSlots: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: var(--available-height);
  `,

  slotViewport: css`
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  `,

  positioner: css`
    --lobe-dropdown-animation-duration: 140ms;
    --lobe-dropdown-animation-scale-y: 0.92;
    --lobe-dropdown-animation-ease-in: ease-in;
    --lobe-dropdown-animation-ease-out: ${cssVar.motionEaseOut};

    z-index: 1100;

    & > * {
      will-change: opacity, transform;
      transform-origin: var(--transform-origin);
      animation: none;
    }

    &[data-open] > * {
      transform: scaleY(1);
      opacity: 1;
      transition:
        opacity var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-out),
        transform var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-out);
    }

    &[data-open] > *[data-starting-style] {
      transform: scaleY(var(--lobe-dropdown-animation-scale-y));
      opacity: 0;
    }

    &[data-closed] > * {
      transform: scaleY(var(--lobe-dropdown-animation-scale-y));
      opacity: 0;
      transition:
        opacity var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-in),
        transform var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-in);
    }

    &[data-hover-trigger] {
      --lobe-dropdown-animation-duration: 140ms;
    }

    &[data-submenu],
    &[data-nested] {
      --lobe-dropdown-animation-duration: 0ms;
      --lobe-dropdown-animation-scale-y: 1;

      z-index: 1199;
    }

    &[data-side='left'],
    &[data-side='right'] {
      --lobe-dropdown-animation-duration: 0ms;
      --lobe-dropdown-animation-scale-y: 1;
    }
  `,

  separator: css`
    height: 1px;
    margin-block: 4px;
    margin-inline: 0;
    background: ${cssVar.colorBorder};
  `,

  submenuArrow: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;
    margin-inline-start: 8px;

    color: var(--lobe-menu-icon-color, ${cssVar.colorTextSecondary});

    & svg {
      width: 12px;
      height: 12px;
    }
  `,
}));
