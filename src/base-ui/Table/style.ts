import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    & th,
    & td {
      border-inline-end: 1px solid ${cssVar.colorBorderSecondary};
    }

    & th:last-child,
    & td:last-child {
      border-inline-end: 0;
    }
  `,
  cell: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    font-variant-numeric: tabular-nums;
    background: ${cssVar.colorBgContainer};
  `,
  clickable: css`
    cursor: pointer;
  `,
  ellipsis: css`
    overflow: hidden;
    max-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  empty: css`
    padding-block: 32px;
    color: ${cssVar.colorTextDescription};
    text-align: center;
  `,
  filterActive: css`
    color: ${cssVar.colorPrimary};
  `,
  filterButton: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 2px;
    border: 0;
    border-radius: 4px;

    color: ${cssVar.colorTextQuaternary};

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  fixed: css`
    z-index: 1;
    background: ${cssVar.colorBgContainer};
  `,
  header: css`
    position: sticky;
    z-index: 2;
    inset-block-start: 0;

    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorTextSecondary};
    text-align: start;
    white-space: nowrap;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      inset 0 -1px 0 ${cssVar.colorBorderSecondary},
      inset 0 999px 0 ${cssVar.colorFillQuaternary};
  `,
  headerInner: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
  `,
  loading: css`
    position: absolute;
    z-index: 3;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent);
  `,
  middle: css`
    & th,
    & td {
      padding-block: 12px;
      padding-inline: 16px;
    }
  `,
  pagination: css`
    display: flex;
    justify-content: flex-end;
    margin-block-start: 12px;
  `,
  root: css`
    min-width: 0;
  `,
  row: css`
    &:hover > td {
      background: color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorText} 3%);
    }

    &:last-child > td {
      border-block-end: 0;
    }
  `,
  small: css`
    & th,
    & td {
      padding-block: 8px;
      padding-inline: 12px;
    }
  `,
  sortButton: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;

    padding: 0;
    border: 0;
    border-radius: 4px;

    font: inherit;
    color: inherit;

    background: none;
  `,
  sortCaret: css`
    display: inline-flex;
    flex-direction: column;
    color: ${cssVar.colorTextQuaternary};

    & > [data-active='true'] {
      color: ${cssVar.colorText};
    }
  `,
  table: css`
    border-spacing: 0;
    border-collapse: separate;
    width: 100%;
    font-size: 14px;
  `,
  wrapper: css`
    position: relative;
    overflow: auto;
  `,
}));
