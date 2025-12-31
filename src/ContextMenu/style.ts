import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  danger: css`
    color: ${cssVar.colorError} !important;

    &:hover {
      background: ${cssVar.colorErrorBg} !important;
    }
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
    overflow: hidden;
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
    z-index: 1000;

    min-width: 200px;
    padding: 4px;
    border-radius: ${cssVar.borderRadius};

    background: ${cssVar.colorBgElevated};
    outline: none;
    box-shadow:
      0 0 15px 0 #00000008,
      0 2px 30px 0 #00000014,
      0 0 0 1px ${cssVar.colorBorder} inset;

    animation: context-menu-fade-in 150ms ${cssVar.motionEaseOut};

    @keyframes context-menu-fade-in {
      from {
        transform: scale(0.96);
        opacity: 0;
      }

      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  separator: css`
    height: 1px;
    margin-block: 4px;
    margin-inline: 0;
    background: ${cssVar.colorBorderSecondary};
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
