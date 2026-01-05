import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  danger: css`
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
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
  `,

  groupLabel: css`
    user-select: none;

    padding-block: 8px 4px;
    padding-inline: 12px;

    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: ${cssVar.colorTextTertiary};
    text-transform: uppercase;
  `,

  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;
    margin-inline-end: 8px;
  `,

  item: css`
    cursor: pointer;
    user-select: none;

    position: relative;

    overflow: hidden;
    display: flex;
    align-items: center;

    width: 100%;
    min-height: 36px;
    padding-block: 8px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};

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

  label: css`
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  popup: css`
    min-width: 120px;
    padding: 4px;
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgElevated};
    outline: none;
    box-shadow:
      0 0 15px 0 #00000008,
      0 2px 30px 0 #00000014,
      0 0 0 1px ${cssVar.colorBorder} inset;
  `,
  positioner: css`
    z-index: 1100;

    &[data-hover-trigger] {
      --lobe-dropdown-animation-duration: 140ms;
      --lobe-dropdown-animation-translate: 6px;
      --lobe-dropdown-animation-scale: 0.98;
      --lobe-dropdown-animation-ease-in: ease-in;
      --lobe-dropdown-animation-ease-out: ${cssVar.motionEaseOut};
      --lobe-dropdown-translate-x: 0;
      --lobe-dropdown-translate-y: calc(var(--lobe-dropdown-animation-translate) * -1);

      & > * {
        will-change: opacity, transform;
        animation: none;
      }

      &[data-open] > * {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 1;
        transition:
          opacity var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-out),
          transform var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-out);
      }

      &[data-open] > *[data-starting-style] {
        transform: translate3d(
            var(--lobe-dropdown-translate-x),
            var(--lobe-dropdown-translate-y),
            0
          )
          scale(var(--lobe-dropdown-animation-scale));
        opacity: 0;
      }

      &[data-closed] > * {
        transform: translate3d(
            var(--lobe-dropdown-translate-x),
            var(--lobe-dropdown-translate-y),
            0
          )
          scale(var(--lobe-dropdown-animation-scale));
        opacity: 0;
        transition:
          opacity var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-in),
          transform var(--lobe-dropdown-animation-duration) var(--lobe-dropdown-animation-ease-in);
      }

      &[data-placement='top'],
      &[data-placement='topCenter'],
      &[data-placement='topLeft'],
      &[data-placement='topRight'] {
        --lobe-dropdown-translate-y: var(--lobe-dropdown-animation-translate);
      }

      &[data-placement='bottom'],
      &[data-placement='bottomCenter'],
      &[data-placement='bottomLeft'],
      &[data-placement='bottomRight'] {
        --lobe-dropdown-translate-y: calc(var(--lobe-dropdown-animation-translate) * -1);
      }
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

    width: 20px;
    height: 20px;
    margin-inline-start: auto;
    padding-inline-start: 8px;
  `,
}));
