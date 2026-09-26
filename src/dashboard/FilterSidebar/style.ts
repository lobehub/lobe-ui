import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  body: css`
    overflow-y: auto;
    max-block-size: 360px;
    padding-block-end: 16px;
    padding-inline: 12px;

    &[data-flush='true'] {
      flex: 1;
      min-block-size: 0;
      max-block-size: none;
    }
  `,
  content: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;

    min-inline-size: 0;
    padding-inline-start: 20px;

    &[data-flush='true'] {
      overflow-y: auto;
      padding: 24px;
    }

    [data-split-card='true'] & {
      padding-block: 16px 0;
      padding-inline: 16px;

      > :last-child {
        margin-inline: -16px;
      }
    }

    ${responsive.laptop} {
      overflow: visible;
      padding: 0;

      > :last-child {
        margin-inline: 0;
      }
    }
  `,
  count: css`
    flex: none;
    font-size: ${cssVar.fontSizeSM};
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextTertiary};
  `,
  drawerPanel: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  head: css`
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;

    padding: 12px;
  `,
  layout: css`
    display: flex;

    &[data-flush='true'] {
      flex: 1;
      min-block-size: 0;
    }

    &[data-split-card='true'] {
      overflow: hidden;
      align-items: stretch;
    }

    ${responsive.laptop} {
      flex-direction: column;
      gap: 12px;
    }
  `,
  name: css`
    overflow: hidden;
    flex: 1;

    min-inline-size: 0;

    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  option: css`
    cursor: pointer;

    display: flex;
    gap: 6px;
    align-items: center;

    inline-size: 100%;
    min-block-size: 36px;
    padding-inline: 8px;
    border: none;
    border-radius: ${cssVar.borderRadius};

    font: inherit;
    color: ${cssVar.colorText};

    background: none;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    &[aria-pressed='true'] {
      font-weight: 500;
      background: ${cssVar.controlItemBgActive};
    }
  `,
  row: css`
    display: flex;
    flex: 1;
    gap: 6px;
    align-items: center;

    min-inline-size: 0;
  `,
  panel: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;

    min-block-size: 0;
    border-inline-end: 1px solid ${cssVar.colorBorderSecondary};

    [data-split-card='true'] & {
      block-size: 100%;
      border-inline-end-color: ${cssVar.colorBorder};
    }
  `,
  sidebar: css`
    align-self: stretch;
    min-block-size: 0;

    &[data-flush='true'] {
      block-size: 100%;
    }
  `,
}));
