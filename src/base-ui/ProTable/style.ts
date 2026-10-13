import { createStaticStyles } from 'antd-style';

export const PRO_PREFIX_CLS = 'lobe-pro-table';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  alert: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    min-height: 40px;
    margin-block-end: 12px;
    padding-block: 6px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};

    font-size: ${cssVar.fontSize};
    color: ${cssVar.colorText};

    background: color-mix(in srgb, ${cssVar.colorPrimary} 8%, transparent);
  `,
  alertInfo: css`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    min-width: 0;
  `,
  alertOption: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
  `,
  part: css`
    min-width: 0;
  `,
  partBordered: css`
    padding: 16px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
  `,
  code: css`
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: ${cssVar.borderRadiusSM};

    font-family: ${cssVar.fontFamilyCode};
    font-size: 0.9em;

    background: ${cssVar.colorFillTertiary};
  `,
  copyable: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    max-width: 100%;
  `,
  copyableText: css`
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
  `,
  density: css`
    display: flex;
    flex-direction: column;
    min-width: 140px;
    padding: 4px;
  `,
  densityItem: css`
    cursor: pointer;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    height: 32px;
    padding-inline: 8px;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    font: inherit;
    color: ${cssVar.colorText};
    text-align: start;

    background: transparent;

    &:hover,
    &:focus-visible {
      background: ${cssVar.colorFillTertiary};
      outline: none;
    }

    &[aria-checked='true'] {
      font-weight: 500;
    }
  `,
  enumList: css`
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  indexBorder: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 18px;
    height: 18px;
    padding-inline: 4px;
    border-radius: 9px;

    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorText};

    background: ${cssVar.colorFillSecondary};

    &[data-top] {
      color: ${cssVar.colorTextLightSolid};
      background: ${cssVar.colorPrimary};
    }
  `,
  lightFilter: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  `,
  lightFilterItem: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    width: 160px;

    & > * {
      width: 100%;
    }
  `,
  lightFilterLabel: css`
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;
  `,
  optionCell: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
  `,
  root: css`
    --lobe-pro-table-status-default: ${cssVar.colorTextQuaternary};
    --lobe-pro-table-status-error: ${cssVar.colorError};
    --lobe-pro-table-status-processing: ${cssVar.colorPrimary};
    --lobe-pro-table-status-success: ${cssVar.colorSuccess};
    --lobe-pro-table-status-warning: ${cssVar.colorWarning};

    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;

    &[data-fullscreen] {
      overflow: auto;
      padding: 16px;
      background: ${cssVar.colorBgLayout};
    }
  `,
  search: css`
    display: grid;
    gap: 16px 24px;
    align-items: center;
  `,
  searchActions: css`
    display: flex;
    grid-column-end: -1;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
  `,
  searchField: css`
    min-width: 0;

    /* The base-ui Form.Field row: no list padding, fixed-width label column, full-width control. */
    & > div {
      gap: 8px;
      padding-block: 0;
    }

    & > div > label {
      overflow: hidden;
      flex: none;

      width: var(--lobe-pro-table-label-width, auto);

      color: ${cssVar.colorTextSecondary};
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &[data-layout='horizontal'] > div > label {
      text-align: end;
    }

    & > div > div {
      flex: 1;
      align-items: stretch;
      min-width: 0;
    }
  `,
  searchFieldControl: css`
    flex: 1;
    min-width: 0;
  `,
  searchLabel: css`
    overflow: hidden;
    flex: none;

    color: ${cssVar.colorTextSecondary};
    text-align: end;
    text-overflow: ellipsis;
    white-space: nowrap;

    &[data-layout='vertical'] {
      text-align: start;
    }
  `,
  setting: css`
    display: flex;
    flex-direction: column;

    width: 260px;
    max-height: 420px;
    padding-block: 4px;
  `,
  settingGroupTitle: css`
    padding-block: 6px 2px;
    padding-inline: 12px;
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextDescription};
  `,
  settingHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-block: 4px 8px;
    padding-inline: 12px;
    border-block-end: 1px solid ${cssVar.colorSplit};
  `,
  settingItem: css`
    display: flex;
    gap: 4px;
    align-items: center;

    min-height: 32px;
    padding-inline: 12px 8px;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    &:hover [data-setting-actions] {
      opacity: 1;
    }
  `,
  settingItemActions: css`
    display: flex;
    flex: none;
    gap: 2px;
    opacity: 0;

    &:focus-within {
      opacity: 1;
    }
  `,
  settingItemTitle: css`
    overflow: hidden;
    flex: 1;

    min-width: 0;

    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  settingList: css`
    overflow: auto;
    flex: 1;
    padding-block: 4px;
  `,
  status: css`
    display: inline-flex;
    gap: 8px;
    align-items: center;
  `,
  statusDot: css`
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  `,
  statusProcessing: css`
    @keyframes lobe-pro-table-status-pulse {
      0% {
        box-shadow: 0 0 0 0 color-mix(in srgb, currentcolor 40%, transparent);
      }

      100% {
        box-shadow: 0 0 0 4px transparent;
      }
    }

    color: ${cssVar.colorPrimary};
    animation: lobe-pro-table-status-pulse 1.2s ease-out infinite;
  `,
  title: css`
    display: flex;
    flex: none;
    gap: 4px;
    align-items: center;

    min-width: 0;

    font-size: ${cssVar.fontSizeLG};
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  titleSub: css`
    font-size: ${cssVar.fontSize};
    font-weight: normal;
    color: ${cssVar.colorTextDescription};
  `,
  titleTooltip: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
  `,
  toolbar: css`
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 16px;
  `,
  toolbarActions: css`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;

    min-width: 0;
    margin-inline-start: auto;
  `,
  toolbarOptions: css`
    display: flex;
    flex: none;
    gap: 2px;
    align-items: center;
  `,
}));
