import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  badge: css`
    flex: none;

    min-inline-size: 20px;
    padding-inline: 6px;
    border-radius: 999px;

    font-size: ${cssVar.fontSizeSM};
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorError};
    text-align: center;

    background: color-mix(in srgb, ${cssVar.colorError} 12%, transparent);
  `,
  chevron: css`
    flex: none;
    transition: transform 160ms ease;

    &[data-expanded='false'] {
      transform: rotate(-90deg);
    }
  `,
  dot: css`
    position: absolute;
    inset-block-start: 7px;
    inset-inline-end: 9px;

    inline-size: 7px;
    block-size: 7px;
    border-radius: 999px;

    background: ${cssVar.colorError};
  `,
  group: css`
    display: flex;
    flex-direction: column;
    margin-block-start: 12px;

    &[data-level='0'][data-icon='true'] {
      margin-block-start: 2px;
    }

    &:not([data-level='0']) {
      margin-block-start: 6px;
    }
  `,
  groupHeader: css`
    cursor: pointer;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    min-block-size: 32px;
    padding-inline: 10px;
    border: none;
    border-radius: ${cssVar.borderRadius};

    font-size: ${cssVar.fontSizeSM};
    font-weight: 500;
    color: ${cssVar.colorTextSecondary};
    text-align: start;

    background: none;

    &:hover,
    &[data-active='true'] {
      color: ${cssVar.colorText};
    }

    &[data-icon='true'] {
      gap: 12px;
      justify-content: flex-start;
      min-block-size: 36px;
      font-size: ${cssVar.fontSize};
    }

    &[data-level='0'][data-icon='true']:hover {
      background: ${cssVar.colorFillTertiary};
    }

    /* Nested groups read as quiet subheadings with the chevron right after the label. */
    &:not([data-level='0']) {
      gap: 2px;
      justify-content: flex-start;

      min-block-size: 26px;

      font-size: ${cssVar.fontSizeSM};
      font-weight: 400;
      color: ${cssVar.colorTextDescription};

      > span:not([role='img']) {
        flex: 0 1 auto;
      }

      > [role='img'] {
        opacity: 0.7;
      }

      &:hover,
      &[data-active='true'] {
        color: ${cssVar.colorTextSecondary};
      }
    }

    &[data-indent='1'] {
      padding-inline-start: 38px;
    }

    &[data-indent='2'] {
      padding-inline-start: 56px;
    }

    > [role='img'] {
      display: flex;
      flex: none;
    }
  `,
  groupItems: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-block-size: 0;
  `,
  groupPanel: css`
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 160ms ease;

    > div {
      overflow: hidden;
    }

    &[data-expanded='false'] {
      grid-template-rows: 0fr;
    }

    &[data-instant='true'] {
      transition: none;
    }
  `,
  item: css`
    position: relative;

    display: flex;
    gap: 10px;
    align-items: center;

    min-block-size: 36px;
    padding-inline: 10px;
    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorTextSecondary};
    text-decoration: none;

    transition:
      background 120ms ease,
      color 120ms ease;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }

    &[data-active='true'] {
      font-weight: 500;
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &[data-indent='1'],
    &[data-indent='2'] {
      min-block-size: 32px;
      color: ${cssVar.colorText};
    }

    &[data-indent='1'] {
      padding-inline-start: 38px;
    }

    &[data-indent='2'] {
      padding-inline-start: 56px;
    }

    > [role='img'] {
      display: flex;
      flex: none;
    }

    &[data-collapsed='true'] {
      justify-content: center;
      min-block-size: 40px;
      padding-inline: 0;
    }

    ${responsive.mobile} {
      min-block-size: 44px;
    }
  `,
  itemLabel: css`
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  nav: css`
    scrollbar-width: thin;

    overflow-y: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;

    min-block-size: 0;
    padding-block-end: 12px;
    padding-inline: 8px;
  `,
  railGroup: css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    margin-block-start: 6px;
    padding-block-start: 6px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};

    &[data-first='true'] {
      margin-block-start: 0;
      border-block-start: none;
    }
  `,
  railTop: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,
  topItems: css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    &[data-divided='true'] {
      margin-block-end: 6px;
      padding-block-end: 8px;
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
  srOnly: css`
    position: absolute;

    overflow: hidden;

    inline-size: 1px;
    block-size: 1px;

    white-space: nowrap;

    clip-path: inset(50%);
  `,
}));
