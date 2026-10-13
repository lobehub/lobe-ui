import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

/** Own prefix so rc-table classNames never collide with antd's global `.ant-table` CSS. */
export const PREFIX_CLS = 'lobe-table';

const p = `.${PREFIX_CLS}`;

// Cell padding comes from the size class through these vars, so title / footer / expanded rows
// can reuse (and negate) it.
const PADDING_BLOCK = '--lobe-table-padding-block';
const PADDING_INLINE = '--lobe-table-padding-inline';

// Matches antd's `zIndexTableFixed`.
const Z_FIXED = 2;

// antd `expandColumnWidth`; nested tables start after it.
export const EXPAND_COLUMN_WIDTH = 48;

// antd `selectionColumnWidth`, plus the `selections` trigger when there is one.
export const SELECTION_COLUMN_WIDTH = 32;
export const SELECTION_DROPDOWN_WIDTH = 16;

/** Rows of this table's own sections only, so the rules never leak into nested tables. */
const ownRows = ['content', 'header', 'body', 'summary']
  .map((section) => `& > ${p}-container > ${p}-${section} > table > * > tr`)
  .join(', ');
const ownCells = (cell: string) =>
  ownRows
    .split(', ')
    .map((row) => `${row} > ${cell}`)
    .join(', ');

export const styles = createStaticStyles(({ css, cssVar }) => {
  const border = `1px solid ${cssVar.colorBorderSecondary}`;
  const fixShadowBase = `
    pointer-events: none;
    content: '';
    position: absolute;
    inset-block: 0 -1px;
    width: 30px;
    transition: box-shadow ${cssVar.motionDurationSlow};
  `;
  const startShadow = `box-shadow: inset 10px 0 8px -8px ${cssVar.colorSplit};`;
  const endShadow = `box-shadow: inset -10px 0 8px -8px ${cssVar.colorSplit};`;

  return {
    bordered: css`
      &${p}-bordered {
        & > ${p}-title {
          border: ${border};
          border-block-end: 0;
          border-start-start-radius: ${cssVar.borderRadiusLG};
          border-start-end-radius: ${cssVar.borderRadiusLG};
        }

        & > ${p}-container {
          overflow: clip;
          border: ${border};
          border-radius: ${cssVar.borderRadiusLG};
        }

        & > ${p}-title + ${p}-container {
          border-start-start-radius: 0;
          border-start-end-radius: 0;
        }

        &:has(> ${p}-footer) > ${p}-container {
          border-end-start-radius: 0;
          border-end-end-radius: 0;
        }

        & > ${p}-footer {
          border: ${border};
          border-block-start: 0;
          border-end-start-radius: ${cssVar.borderRadiusLG};
          border-end-end-radius: ${cssVar.borderRadiusLG};
        }

        ${ownCells('th')}, ${ownCells('td')} {
          border-inline-end: ${border};
        }

        ${ownCells('th:last-child')}, ${ownCells('td:last-child')} {
          border-inline-end: 0;
        }

        & > ${p}-container > * > table > thead > tr:not(:last-child) > th {
          border-block-end: ${border};
        }

        & ${p}-tbody-virtual ${p}-cell {
          border-inline-end: ${border};
        }
      }
    `,
    clickable: css`
      cursor: pointer;
    `,
    /** Title text of an `ellipsis` column; truncates inside the sort button / header controls. */
    columnTitle: css`
      overflow: hidden;

      min-width: 0;

      text-overflow: ellipsis;
      word-break: keep-all;
      white-space: nowrap;
    `,
    filterActive: css`
      color: ${cssVar.colorPrimary};

      &:hover {
        color: ${cssVar.colorPrimary};
      }
    `,
    filterButton: css`
      ${focusRing};
      cursor: pointer;

      display: inline-flex;
      flex: none;
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
    filterButtons: css`
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;

      padding-block: 7px;
      padding-inline: 8px;
      border-block-start: 1px solid ${cssVar.colorSplit};
    `,
    filterCheckAll: css`
      margin-block-end: 4px;
      padding-inline: 4px;
    `,
    filterDropdown: css`
      display: flex;
      flex-direction: column;
      min-width: 120px;
    `,
    filterEmpty: css`
      padding-block: 16px;
      padding-inline: 0;
    `,
    filterGroup: css`
      display: flex;
      flex-direction: column;

      & > div:not(:first-child) {
        padding-inline-start: 20px;
      }
    `,
    filterGroupTitle: css`
      padding-block: 5px;
      padding-inline: 8px;
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    `,
    filterItem: css`
      display: flex;
      align-items: center;

      padding-block: 5px;
      padding-inline: 8px;
      border-radius: ${cssVar.borderRadiusSM};

      white-space: nowrap;

      &:hover {
        background: ${cssVar.colorFillTertiary};
      }

      & > label {
        cursor: pointer;
        flex: 1;
      }
    `,
    filterMenu: css`
      overflow: auto;
      display: flex;
      flex-direction: column;

      max-height: 264px;
      padding: 4px;
    `,
    filterPopup: css`
      overflow: hidden;
      padding: 0;
    `,
    filterSearch: css`
      padding: 8px;
      border-block-end: 1px solid ${cssVar.colorSplit};
    `,
    filterTree: css`
      overflow: auto;
      max-height: 264px;
      padding: 8px;
    `,
    headerInner: css`
      display: inline-flex;
      gap: 6px;
      align-items: center;

      min-width: 0;
      max-width: 100%;

      vertical-align: middle;
    `,
    hoverable: css`
      & ${p}-tbody > tr > ${p}-cell-row-hover, & ${p}-tbody-virtual ${p}-row:hover > ${p}-cell {
        background: color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorText} 3%);
      }
    `,
    loading: css`
      position: absolute;
      z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 2);
      inset: 0;

      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      justify-content: center;

      color: ${cssVar.colorTextSecondary};

      background: color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent);
    `,
    pagination: css`
      display: flex;
      margin-block-start: 12px;
    `,
    paginationCenter: css`
      justify-content: center;
    `,
    paginationEnd: css`
      justify-content: flex-end;
    `,
    paginationStart: css`
      justify-content: flex-start;
    `,
    paginationTop: css`
      margin-block: 0 12px;
    `,
    root: css`
      min-width: 0;
    `,
    /** Header box of the selection column; `selectionExtra` hangs off its end. */
    selection: css`
      position: relative;
      display: inline-flex;
      flex-direction: column;
      vertical-align: middle;
    `,
    selectionColumn: css`
      && {
        padding-inline: 8px;
        text-align: center;
      }

      & > * {
        vertical-align: middle;
      }
    `,
    selectionExtra: css`
      position: absolute;
      z-index: 1;
      inset-block-start: 0;

      display: flex;
      align-items: center;

      height: 100%;
      margin-inline-start: 100%;
      padding-inline-start: 2px;
    `,
    selectionRadioGroup: css`
      display: inline-flex;
      vertical-align: middle;
    `,
    selectionTrigger: css`
      cursor: pointer;

      display: inline-flex;
      align-items: center;

      padding: 0;
      border: 0;

      color: ${cssVar.colorTextQuaternary};

      background: none;

      transition: color ${cssVar.motionDurationMid};

      &:hover {
        color: ${cssVar.colorTextSecondary};
      }

      ${focusRing};
    `,
    sizeLarge: css`
      ${PADDING_BLOCK}: 16px;
      ${PADDING_INLINE}: 16px;
    `,
    sizeMedium: css`
      ${PADDING_BLOCK}: 12px;
      ${PADDING_INLINE}: 16px;
    `,
    sizeSmall: css`
      ${PADDING_BLOCK}: 8px;
      ${PADDING_INLINE}: 12px;
    `,
    sortButton: css`
      ${focusRing};
      cursor: pointer;

      display: inline-flex;
      gap: 6px;
      align-items: center;

      min-width: 0;
      max-width: 100%;
      padding: 0;
      border: 0;
      border-radius: 4px;

      font: inherit;
      color: inherit;

      background: none;
    `,
    sortCaret: css`
      display: inline-flex;
      flex: none;
      flex-direction: column;
      color: ${cssVar.colorTextQuaternary};

      & > [data-active='true'] {
        color: ${cssVar.colorText};
      }
    `,
    sortIcon: css`
      display: inline-flex;
      flex: none;
      align-items: center;
    `,
    sortedColumn: css`
      ${p}-tbody > tr > &${p}-cell {
        background: ${cssVar.colorFillQuaternary};
      }
    `,
    spinContainer: css`
      position: relative;
    `,
    table: css`
      font-size: 14px;
      color: ${cssVar.colorText};
      background: ${cssVar.colorBgContainer};

      & table {
        border-spacing: 0;
        border-collapse: separate;
        width: 100%;
        text-align: start;
      }

      /* ============================== Cell ============================== */
      & ${p}-cell, & ${p}-thead > tr > th,
      & ${p}-tbody > tr > td,
      & tfoot > tr > th,
      & tfoot > tr > td {
        position: relative;
        padding-block: var(${PADDING_BLOCK});
        padding-inline: var(${PADDING_INLINE});
        overflow-wrap: break-word;
      }

      & ${p}-thead > tr > th,
      & ${p}-thead > tr > td {
        font-size: 13px;
        font-weight: 500;
        color: ${cssVar.colorTextSecondary};
        text-align: start;

        background: ${cssVar.colorBgContainer};
        box-shadow:
          inset 0 -1px 0 ${cssVar.colorBorderSecondary},
          inset 0 999px 0 ${cssVar.colorFillQuaternary};

        &[colspan]:not([colspan='1']) {
          text-align: center;
        }
      }

      /* th covers rowScope row headers. */
      & ${p}-tbody > tr > td,
      & ${p}-tbody > tr > th {
        border-block-end: ${border};

        font-weight: inherit;
        font-variant-numeric: tabular-nums;
        text-align: start;

        background: ${cssVar.colorBgContainer};

        transition: background-color ${cssVar.motionDurationMid};
      }

      &:not(${p}-bordered) ${p}-tbody > tr:last-child > td,
      &:not(${p}-bordered) ${p}-tbody > tr:last-child > th {
        border-block-end: 0;
      }

      & ${p}-tbody > tr${p}-placeholder > td {
        padding-block: 32px;
        color: ${cssVar.colorTextDescription};
        text-align: center;
      }

      & ${p}-cell-scrollbar:not([rowspan]) {
        box-shadow: 0 1px 0 1px ${cssVar.colorFillQuaternary};
      }

      /* ============================ Ellipsis ============================ */
      & ${p}-cell-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;

        &${p}-cell-fix-start-shadow, &${p}-cell-fix-end-shadow {
          overflow: visible;

          & ${p}-cell-content {
            overflow: hidden;
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      /* ========================== Title / Footer ========================= */
      & > ${p}-title, & > ${p}-footer {
        padding-block: var(${PADDING_BLOCK});
        padding-inline: var(${PADDING_INLINE});
      }

      & > ${p}-footer {
        color: ${cssVar.colorText};
        background: ${cssVar.colorFillQuaternary};
      }

      /* ============================== Fixed ============================= */
      & ${p}-container {
        position: relative;

        &::before,
        &::after {
          ${fixShadowBase}
          z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 1);
        }

        &::before {
          inset-inline-start: 0;
        }

        &::after {
          inset-inline-end: 0;
        }
      }

      &${p}-has-fix-start > ${p}-container::before, &${p}-has-fix-end > ${p}-container::after {
        display: none;
      }

      &${p}-fix-start-shadow-show > ${p}-container::before {
        ${startShadow}
      }

      &${p}-fix-end-shadow-show > ${p}-container::after {
        ${endShadow}
      }

      /* Must outrank the generic cell rule that sets position: relative. */
      &
        ${p}-thead
        > tr
        > th${p}-cell-fix,
        &
        ${p}-tbody
        > tr
        > td${p}-cell-fix,
        &
        ${p}-cell${p}-cell-fix {
        position: sticky;
        z-index: calc(var(--z-offset-reverse) + ${Z_FIXED});
      }

      & ${p}-cell-fix {
        background: ${cssVar.colorBgContainer};

        &::after {
          ${fixShadowBase}
        }
      }

      & ${p}-cell-fix-start::after {
        inset-inline-start: 100%;
      }

      & ${p}-cell-fix-end::after {
        inset-inline-end: 100%;
      }

      & ${p}-cell-fix-start-shadow-show::after {
        ${startShadow}
      }

      & ${p}-cell-fix-end-shadow-show::after {
        ${endShadow}
      }

      /* ============================= Sticky ============================= */
      & ${p}-sticky-holder {
        position: sticky;
        z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 1);
        background: ${cssVar.colorBgContainer};
      }

      & ${p}-sticky-scroll {
        position: sticky;
        z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 1);
        inset-block-end: 0;

        display: flex;
        align-items: center;

        height: 8px !important;
        border-block-start: ${border};

        opacity: 0.65;
        background: ${cssVar.colorFillQuaternary};

        &-bar {
          position: absolute;
          inset-block-end: 0;

          height: 8px;
          border-radius: 100px;

          background-color: ${cssVar.colorFill};

          transition:
            all ${cssVar.motionDurationSlow},
            transform 0s;

          &:hover,
          &-active {
            background-color: ${cssVar.colorFillSecondary};
          }
        }
      }

      /* ============================ Selection =========================== */
      & ${p}-selection-col {
        width: ${SELECTION_COLUMN_WIDTH}px;

        &${p}-selection-col-with-dropdown {
          width: ${SELECTION_COLUMN_WIDTH + SELECTION_DROPDOWN_WIDTH}px;
        }
      }

      &${p}-bordered ${p}-selection-col {
        width: ${SELECTION_COLUMN_WIDTH + 16}px;

        &${p}-selection-col-with-dropdown {
          width: ${SELECTION_COLUMN_WIDTH + SELECTION_DROPDOWN_WIDTH + 16}px;
        }
      }

      & ${p}-tbody > tr${p}-row-selected > td {
        background: color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorPrimary} 6%);

        &${p}-cell-row-hover {
          background: color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorPrimary} 10%);
        }
      }

      /* ========================= Expand / Tree ========================== */
      & ${p}-expand-icon-col {
        width: ${EXPAND_COLUMN_WIDTH}px;
      }

      & ${p}-row-expand-icon-cell {
        text-align: center;

        & ${p}-row-expand-icon {
          float: none;
          display: inline-flex;
          vertical-align: sub;
        }
      }

      & ${p}-row-indent {
        float: inline-start;
        height: 1px;
      }

      & ${p}-row-expand-icon {
        ${focusRing};
        cursor: pointer;

        position: relative;

        float: inline-start;

        box-sizing: border-box;
        width: 17px;
        height: 17px;
        padding: 0;
        border: ${border};
        border-radius: 4px;

        color: inherit;

        background: ${cssVar.colorBgContainer};

        &::before,
        &::after {
          content: '';
          position: absolute;
          background: currentcolor;
          transition: transform ${cssVar.motionDurationSlow} ease-out;
        }

        &::before {
          inset-block-start: 7px;
          inset-inline: 3px;
          height: 1px;
        }

        &::after {
          inset-block: 3px;
          inset-inline-start: 7px;
          transform: rotate(90deg);
          width: 1px;
        }

        &:hover {
          border-color: currentcolor;
        }

        &${p}-row-expand-icon-collapsed::before {
          transform: rotate(-180deg);
        }

        &${p}-row-expand-icon-collapsed::after {
          transform: rotate(0deg);
        }

        &${p}-row-expand-icon-spaced {
          border: 0;
          visibility: hidden;
          background: transparent;

          &::before,
          &::after {
            content: none;
            display: none;
          }
        }
      }

      & ${p}-row-indent + ${p}-row-expand-icon {
        margin-block-start: 2px;
        margin-inline-end: 8px;
      }

      & tr${p}-expanded-row > td,
      & tr${p}-expanded-row:hover > td {
        background: ${cssVar.colorFillQuaternary};
      }

      & ${p}-expanded-row-fixed {
        position: relative;

        margin-block: calc(var(${PADDING_BLOCK}) * -1);
        margin-inline: calc(var(${PADDING_INLINE}) * -1);
        padding-block: var(${PADDING_BLOCK});
        padding-inline: var(${PADDING_INLINE});
      }

      /* ========================== Nested table ========================== */

      /* A table alone in a cell fills it, starting after the expand column. */
      &
        ${p}-tbody
        > tr
        > td
        > ${p}-wrapper:only-child,
        &
        ${p}-tbody
        > tr
        > td
        > ${p}-expanded-row-fixed
        > ${p}-wrapper:only-child {
        & ${p} {
          margin-block: calc(var(${PADDING_BLOCK}) * -1);
          margin-inline: calc(${EXPAND_COLUMN_WIDTH}px - var(${PADDING_INLINE}))
            calc(var(${PADDING_INLINE}) * -1);
        }

        & ${p}-tbody > tr:last-child > td {
          border-block-end: 0;
        }

        /* The outer cell already draws the frame: keep only the start edge of a bordered nest. */
        & ${p}${p}-bordered {
          & > ${p}-title, & > ${p}-container, & > ${p}-footer {
            border-block: 0;
            border-inline-end: 0;
            border-radius: 0;
          }

          & > ${p}-title + ${p}-container {
            border-block-start: ${border};
          }

          &:has(> ${p}-footer) > ${p}-container {
            border-block-end: ${border};
          }
        }
      }

      &${p}-bordered ${p}-tbody > tr > td > ${p}-expanded-row-fixed {
        margin-inline: calc((var(${PADDING_INLINE}) + 1px) * -1);
      }

      /* ============================= Summary ============================ */
      & ${p}-summary {
        position: relative;
        z-index: ${Z_FIXED};
        background: ${cssVar.colorBgContainer};

        & > tr > th,
        & > tr > td {
          border-block-end: ${border};
        }
      }

      & div${p}-summary {
        box-shadow: 0 -1px 0 ${cssVar.colorBorderSecondary};
      }

      /* A fixed summary under \`sticky\` is a sticky holder too; keep it sticky (antd orders sticky last). */
      & ${p}-summary${p}-sticky-holder {
        position: sticky;
        z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 1);
      }

      & tfoot > tr > th,
      & tfoot > tr > td {
        border-block-start: ${border};
      }

      /* ============================= Virtual ============================ */
      & ${p}-tbody-virtual {
        &
          ${p}-tbody-virtual-holder-inner
          > ${p}-row,
          &
          ${p}-tbody-virtual-holder-inner
          > div:not(${p}-row)
          > ${p}-row {
          display: flex;
          box-sizing: border-box;
          width: 100%;

          & > ${p}-cell {
            align-content: center;
          }
        }

        & ${p}-cell {
          border-block-end: ${border};
          background: ${cssVar.colorBgContainer};
          transition: background-color ${cssVar.motionDurationMid};
        }

        & ${p}-tbody-virtual-scrollbar {
          cursor: pointer;

          &:hover {
            background-color: ${cssVar.colorFillQuaternary};
          }
        }

        & ${p}-expanded-row ${p}-expanded-row-cell${p}-expanded-row-cell-fixed {
          position: sticky;
          inset-inline-start: 0;
          overflow: hidden;
          width: calc(var(--virtual-width) - 1px);
        }
      }
    `,
  };
});
