import { createStaticStyles } from 'antd-style';

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
export const SELECTION_DROPDOWN_WIDTH = 24;

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
  // Light colorFill / dark colorFillSecondary (see --lobe-fill-border in ThemeProvider).
  const borderColor = `var(--lobe-fill-border, ${cssVar.colorFill})`;
  const border = `1px solid ${borderColor}`;
  // Dark: colorFillQuaternary on the clipped container; unset in light so variants keep their fills.
  const surface = (light: string) => `var(--lobe-table-surface, ${light})`;
  // Cell background. Every table root resets it to colorBgContainer (so nested / borderless
  // tables never inherit it); outlined / filled switch it to transparent in dark.
  const cellBg = `var(--lobe-table-cell, ${cssVar.colorBgContainer})`;
  // The variant fill that opaque composites (fixed cells, sticky holder, summary) repeat
  // once. Reset to transparent per root; outlined / filled set it to the dark surface.
  const fill = 'var(--lobe-table-fill, transparent)';
  // Row states: translucent fills on the cell only (never on tr), same for every variant,
  // normal / fixed cells and the virtual body.
  const hoverBg = cssVar.colorFillTertiary;
  const selectedBg = `color-mix(in srgb, ${cssVar.colorPrimary} 6%, transparent)`;
  const selectedHoverBg = `color-mix(in srgb, ${cssVar.colorPrimary} 10%, transparent)`;
  // Fixed cells are see-through. Their frosted backdrop is not painted per cell (each box
  // would blur on its own and show seams at every row): FixedFrost portals one sticky pane
  // per fixed side into each scroll host (frostRail / frostStart / frostEnd below). The
  // sticky header is a single element and blurs itself.
  const frost = `
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
  `;
  const variantVars = `
    --lobe-table-cell: var(--lobe-table-cell-bg, ${cssVar.colorBgContainer});
    --lobe-table-fill: var(--lobe-table-surface, transparent);
  `;
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

  /* Rounded corners. overflow:clip + radius on the container alone is not enough: corner
     fixed cells (own stacking layer), header washes and the FixedFrost backdrop-filter panes
     are composited separately and WebKit (and browsers without overflow:clip) paint them
     square past the radius. So the corner cells and frost panes carry the matching inner
     radius themselves (vars inherit from the container; 0 next to title / footer). A
     clip-path on the sections is avoided: it becomes a backdrop root and kills the blur. */
  const cornerClip = (radius: string) => `
    & > ${p}-container {
      --lobe-table-radius-top: ${radius};
      --lobe-table-radius-bottom: ${radius};
    }

    & > ${p}-title + ${p}-container {
      --lobe-table-radius-top: 0px;
    }

    &:has(> ${p}-footer) > ${p}-container {
      --lobe-table-radius-bottom: 0px;
    }

    ${ownRows
      .split(', ')
      .map((r) => r.replace(' > * > tr', ' > thead > tr:first-child > :first-child'))
      .join(', ')} {
      border-start-start-radius: var(--lobe-table-radius-top);
    }

    ${ownRows
      .split(', ')
      .map((r) => r.replace(' > * > tr', ' > thead > tr:first-child > :last-child'))
      .join(', ')} {
      border-start-end-radius: var(--lobe-table-radius-top);
    }

    ${ownRows
      .split(', ')
      .map((r) => r.replace(' > * > tr', ' > tbody > tr:last-child > :first-child'))
      .join(', ')} {
      border-end-start-radius: var(--lobe-table-radius-bottom);
    }

    ${ownRows
      .split(', ')
      .map((r) => r.replace(' > * > tr', ' > tbody > tr:last-child > :last-child'))
      .join(', ')} {
      border-end-end-radius: var(--lobe-table-radius-bottom);
    }

    & ${p}-frost-start, & ${p}-frost-end {
      border-radius: inherit;
    }
  `;

  return {
    outlined: css`
      &${p}-outlined {
        ${variantVars}
        ${cornerClip(`calc(${cssVar.borderRadiusLG} - 1px)`)}
        /* The square root must not paint behind the rounded frame: the clipped container
           is the ONE layer carrying the body (light colorBgContainer, dark
           colorFillQuaternary). Title / footer are siblings, so they paint it once too. */
        background: transparent;

        & > ${p}-container {
          background: ${surface(cssVar.colorBgContainer)};
        }

        & > ${p}-title, & > ${p}-footer {
          background: ${surface(cssVar.colorBgContainer)};
        }

        & > ${p}-title {
          border: ${border};
          border-block-end: 0;
          border-start-start-radius: ${cssVar.borderRadiusLG};
          border-start-end-radius: ${cssVar.borderRadiusLG};
        }

        /* The container draws the full frame (incl. bottom). Last-row borders used to stand
           in for the bottom edge, but with scroll.y / virtual the last row sits inside the
           body viewport - overflow:clip + radius then eats that line at the rounded corners.
           No column dividers (grouped headers included): rows are split horizontally only. */
        & > ${p}-container {
          overflow: clip;
          border: ${border};
          border-radius: ${cssVar.borderRadiusLG};

          /* Same lift as the dashboard Surface card (both modes). Outer shadow on the framed
             container is not clipped by its own overflow. */
          box-shadow: rgb(0 0 0 / 4%) 0 1px 2px 0;
        }

        & > ${p}-title + ${p}-container {
          border-start-start-radius: 0;
          border-start-end-radius: 0;
        }

        &:has(> ${p}-footer) > ${p}-container {
          border-block-end: 0;
          border-end-start-radius: 0;
          border-end-end-radius: 0;
        }

        & > ${p}-footer {
          border: ${border};
          border-block-start: 0;
          border-end-start-radius: ${cssVar.borderRadiusLG};
          border-end-end-radius: ${cssVar.borderRadiusLG};
        }

        /* Every header row (including the last) draws one bottom edge — no inset
           shadow underneath, or group headers look double-thick. */
        & > ${p}-container > * > table > thead > tr > th {
          border-block-end: ${border};

          /* Extra FillQuaternary layer on top of the container fill. */
          background: ${cellBg};
          box-shadow: inset 0 999px 0 ${cssVar.colorFillQuaternary};
        }

        /* Fixed cells: see-through (container fill shows) + backdrop blur only. */
        & ${p}-tbody > tr > td${p}-cell-fix, & ${p}-tbody-virtual ${p}-cell${p}-cell-fix {
          background: transparent;
          box-shadow: none;
        }

        /* Header: container fill + one Quaternary wash (box-shadow), like other th. */
        & ${p}-thead > tr > th${p}-cell-fix, & ${p}-thead > tr > td${p}-cell-fix {
          background: transparent;
          box-shadow: inset 0 999px 0 ${cssVar.colorFillQuaternary};
        }
      }
    `,

    /* Mirrors Block \`filled\`: one colorFillTertiary (dark: colorFillQuaternary on the clipped
       container) surface straight on the parent and no frame border. */
    /* FixedFrost rail: absolute over the table (or the virtual row layer), z-index 1 puts it
       above scrolling cells (z auto) and under fixed cells (z >= 2). */
    frostRail: css`
      pointer-events: none;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-start: 0;

      display: flex;
    `,
    frostStart: css`
      position: sticky;

      border-start-start-radius: var(--lobe-table-radius-top, 0);
      border-end-start-radius: var(--lobe-table-radius-bottom, 0);

      inset-inline-start: 0;

      flex: none;

      height: 100%;
      ${frost}
    `,
    frostEnd: css`
      position: sticky;

      border-start-end-radius: var(--lobe-table-radius-top, 0);
      border-end-end-radius: var(--lobe-table-radius-bottom, 0);

      inset-inline-end: 0;

      flex: none;

      height: 100%;
      margin-inline-start: auto;
      ${frost}
    `,
    filled: css`
      &${p}-filled {
        ${variantVars}
        ${cornerClip(cssVar.borderRadiusLG)}
        /* Filled owns its fill in both modes (Block filled = colorFillTertiary; dark uses the
           Quaternary surface) and its opaque base is the page behind it, not colorBgContainer. */
        --lobe-table-fill: var(--lobe-table-surface, ${cssVar.colorFillTertiary});

        /* Root stays clear (square box, would bleed past the rounded corners); the clipped
           container is the ONE fill layer: light FillTertiary, dark colorFillQuaternary. */
        background: transparent;

        & > ${p}-title, & > ${p}-footer {
          border-radius: ${cssVar.borderRadiusLG};
          background: ${fill};
        }

        & > ${p}-title {
          border-end-start-radius: 0;
          border-end-end-radius: 0;
        }

        & > ${p}-footer {
          border-start-start-radius: 0;
          border-start-end-radius: 0;
        }

        & > ${p}-container {
          overflow: clip;
          border-radius: ${cssVar.borderRadiusLG};
          background: ${fill};
        }

        & > ${p}-title + ${p}-container {
          border-start-start-radius: 0;
          border-start-end-radius: 0;
        }

        &:has(> ${p}-footer) > ${p}-container {
          border-end-start-radius: 0;
          border-end-end-radius: 0;
        }

        /* Header band: one extra FillQuaternary wash over the container fill. */
        & ${p}-thead > tr > th,
        & ${p}-thead > tr > td {
          background: transparent;
          box-shadow:
            inset 0 -1px 0 ${borderColor},
            inset 0 999px 0 ${cssVar.colorFillQuaternary};
        }

        /* Row dividers stay on (base border rule); body is clear over the container fill. */
        & ${p}-tbody > tr > td,
        & ${p}-tbody > tr > th,
        & ${p}-tbody-virtual ${p}-cell {
          background: transparent;
        }

        /* Fixed cells: see-through + blur; header keeps the same divider + wash as every th. */
        & ${p}-thead > tr > th${p}-cell-fix, & ${p}-thead > tr > td${p}-cell-fix {
          background: transparent;
          box-shadow:
            inset 0 -1px 0 ${borderColor},
            inset 0 999px 0 ${cssVar.colorFillQuaternary};
        }

        & ${p}-tbody > tr > td${p}-cell-fix {
          background: transparent;
          box-shadow: none;
        }
      }
    `,
    /**
     * Borderless: everything but the header is see-through, so the table sits on whatever
     * surface hosts it. Hover / selected rows are translucent fills. Fixed (sticky) cells
     * are see-through with a frosted backdrop so scrolled content stays obscured.
     */
    borderless: css`
      && {
        background: transparent;
      }

      && ${p}-tbody > tr > td,
      && ${p}-tbody > tr > th,
      && ${p}-tbody-virtual ${p}-cell, && ${p}-summary, && ${p}-summary > tr > td,
      && ${p}-summary > tr > th,
      && > ${p}-footer {
        background: transparent;
      }

      && ${p}-tbody > tr > td${p}-cell-row-hover, && ${p}-tbody-virtual ${p}-row:hover > ${p}-cell {
        background: ${hoverBg};
      }

      && ${p}-tbody > tr${p}-row-selected > td {
        background: ${selectedBg};

        &${p}-cell-row-hover {
          background: ${selectedHoverBg};
        }
      }

      &&
        ${p}-tbody
        > tr
        > td${p}-cell-fix,
        &&
        ${p}-tbody
        > tr
        > th${p}-cell-fix,
        &&
        ${p}-tbody-virtual
        ${p}-cell${p}-cell-fix {
        background: transparent;
      }

      && ${p}-tbody > tr > td${p}-cell-fix${p}-cell-row-hover {
        background: ${hoverBg};
      }

      && ${p}-tbody > tr${p}-row-selected > td${p}-cell-fix {
        background: ${selectedBg};

        &${p}-cell-row-hover {
          background: ${selectedHoverBg};
        }
      }
    `,
    /**
     * Grouped (multi-level) headers only: column dividers in header and body so the
     * group spans stay readable. Plain tables never get vertical dividers.
     */
    grouped: css`
      ${ownCells('th')}, ${ownCells('td')} {
        border-inline-end: ${border};
      }

      & ${p}-tbody-virtual ${p}-cell {
        border-inline-end: ${border};
      }

      /* Outlined: the container already draws the trailing edge. Other variants: the
         rightmost body cell and first header row cell stop at the table edge. */
      &:not(${p}-outlined) ${p}-tbody > tr > td:last-child,
      &:not(${p}-outlined) ${p}-thead > tr:first-child > th:last-child,
      &${p}-outlined ${p}-tbody > tr > td:last-child,
      &${p}-outlined ${p}-thead > tr:first-child > th:last-child {
        border-inline-end: 0;
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
      &&,
      &&:hover {
        color: ${cssVar.colorPrimary};
      }
    `,
    filterButton: css`
      flex: none;
      margin-block: -4px;
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
      /* &&& outranks the variant cell rules (filled clear cells, transparent fixed cells). */
      &&& ${p}-tbody > tr > ${p}-cell-row-hover, &&& ${p}-tbody-virtual ${p}-row:hover > ${p}-cell {
        background: ${hoverBg};
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
    /**
     * Empty-state loading body. Tracks follow leaf column widths so bars sit under the
     * live header; cell padding reuses the size CSS vars on the table ancestor.
     */
    skeleton: css`
      display: flex;
      flex-direction: column;

      width: 100%;
      min-width: 0;

      text-align: start;
    `,
    skeletonCell: css`
      display: flex;
      align-items: center;

      min-width: 0;
      padding-block: var(${PADDING_BLOCK});
      padding-inline: var(${PADDING_INLINE});
    `,
    skeletonRow: css`
      display: grid;
      align-items: stretch;

      width: 100%;
      min-width: 0;
      border-block-end: 1px solid ${borderColor};

      &:last-child {
        border-block-end: 0;
      }
    `,
    // antd `paginationMargin` (token.margin): keep the pager off the table above and off
    // whatever sits below the table.
    pagination: css`
      display: flex;
      margin-block: 16px;
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
      margin-block: 0 16px;
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
      flex: none;
      margin-block: -4px;
    `,
    sizeLarge: css`
      ${PADDING_BLOCK}: 16px;
      ${PADDING_INLINE}: 16px;

      /* Same as VIRTUAL_ROW_HEIGHT in Table.tsx (padding * 2 + 22px line + 1px divider). */
      --lobe-table-virtual-row-height: calc(16px * 2 + 23px);
    `,
    sizeMedium: css`
      ${PADDING_BLOCK}: 12px;
      ${PADDING_INLINE}: 16px;

      /* Same as VIRTUAL_ROW_HEIGHT in Table.tsx (padding * 2 + 22px line + 1px divider). */
      --lobe-table-virtual-row-height: calc(12px * 2 + 23px);
    `,
    sizeSmall: css`
      ${PADDING_BLOCK}: 8px;
      ${PADDING_INLINE}: 12px;

      /* Same as VIRTUAL_ROW_HEIGHT in Table.tsx (padding * 2 + 22px line + 1px divider). */
      --lobe-table-virtual-row-height: calc(8px * 2 + 23px);
    `,
    // Title + sort ActionIcon row (not a button — the ActionIcon owns the click).
    sortButton: css`
      display: inline-flex;
      gap: 4px;
      align-items: center;

      min-width: 0;
      max-width: 100%;
    `,
    // Matches the filter trigger: small ActionIcon with a slight negative margin so the
    // 24px block does not grow the header.
    sortCaret: css`
      flex: none;
      margin-block: -4px;
    `,
    sortTitle: css`
      cursor: pointer;
      min-width: 0;
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
      /* Reset per root so nested / borderless tables never inherit a parent's variant vars. */
      --lobe-table-cell: ${cssVar.colorBgContainer};
      --lobe-table-fill: transparent;

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

        /* The global \`* { vertical-align: baseline }\` reset drops the UA's middle for cells. */
        vertical-align: middle;
      }

      /* Row-merged body cells (rowSpan > 1, table and virtual body alike) get vertical
         dividers so the block reads apart from the neighbour rows' lines. Drawn on ::before
         (::after is the fixed-column scroll shadow) so cell box-shadows stay untouched. The
         first / last column skip the edge the frame or table edge already provides. */
      & ${p}-tbody > tr > td[rowspan]:not([rowspan='0'], [rowspan='1'])::before,
      & ${p}-tbody-virtual ${p}-cell[rowspan]:not([rowspan='0'], [rowspan='1'])::before {
        pointer-events: none;
        content: '';

        position: absolute;
        inset: 0;

        border-inline: ${border};
      }

      & ${p}-tbody > tr > td[rowspan]:first-child::before,
      & ${p}-tbody-virtual ${p}-cell[rowspan]:first-child::before {
        border-inline-start: 0;
      }

      & ${p}-tbody > tr > td[rowspan]:last-child::before,
      & ${p}-tbody-virtual ${p}-cell[rowspan]:last-child::before {
        border-inline-end: 0;
      }

      & ${p}-thead > tr > th,
      & ${p}-thead > tr > td {
        font-size: 13px;
        font-weight: 500;
        color: ${cssVar.colorTextSecondary};
        text-align: start;

        /* Clear in dark (outlined) so the container fill shows; Quaternary is the extra header layer. */
        background: ${cellBg};
        box-shadow:
          inset 0 -1px 0 ${borderColor},
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

        /* Clear in dark (outlined) so the container fill shows through. */
        background: ${cellBg};

        transition: background-color ${cssVar.motionDurationMid};
      }

      /* Filled / outlined drop the last body divider: filled because its fill is the edge,
         outlined because the container now draws the frame bottom (avoids a double line, and
         keeps the outline when scroll.y / virtual would otherwise scroll the last-row edge
         away). Borderless keeps it as the closing rule under the rows. */
      &${p}-filled ${p}-tbody > tr:last-child > td,
      &${p}-filled ${p}-tbody > tr:last-child > th,
      &${p}-outlined ${p}-tbody > tr:last-child > td,
      &${p}-outlined ${p}-tbody > tr:last-child > th {
        border-block-end: 0;
      }

      /* Borderless with a summary: tfoot draws its own top rule, so skip the last-row one. */
      &${p}-borderless table:has(> tfoot) > ${p}-tbody > tr:last-child > td,
      &${p}-borderless table:has(> tfoot) > ${p}-tbody > tr:last-child > th {
        border-block-end: 0;
      }

      & ${p}-tbody > tr${p}-placeholder > td {
        padding-block: 32px;
        color: ${cssVar.colorTextDescription};
        text-align: center;
      }

      /* Skeleton loading fills the placeholder like real body rows. */
      & ${p}-tbody > tr${p}-placeholder > td:has([data-table-skeleton]) {
        padding: 0;
        color: inherit;
        text-align: start;
        vertical-align: top;
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
        background: transparent;

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
        background: transparent;

        /* The whole sticky header is one element, so it blurs as one continuous block. */
        ${frost}
      }

      & ${p}-sticky-scroll {
        position: sticky;
        z-index: calc(var(--columns-count, 1) * 2 + ${Z_FIXED} + 1);
        inset-block-end: 0;
      }

      /* ============================ Selection =========================== */
      & ${p}-selection-col {
        width: ${SELECTION_COLUMN_WIDTH}px;

        &${p}-selection-col-with-dropdown {
          width: ${SELECTION_COLUMN_WIDTH + SELECTION_DROPDOWN_WIDTH}px;
        }
      }

      &${p}-outlined ${p}-selection-col {
        width: ${SELECTION_COLUMN_WIDTH + 16}px;

        &${p}-selection-col-with-dropdown {
          width: ${SELECTION_COLUMN_WIDTH + SELECTION_DROPDOWN_WIDTH + 16}px;
        }
      }

      /* The table css carries no hoverable class, so use a fourth & to outrank hover too. */
      &&&& ${p}-tbody > tr${p}-row-selected > td {
        background: ${selectedBg};

        &${p}-cell-row-hover {
          background: ${selectedHoverBg};
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
        float: inline-start;
        flex: none;
        vertical-align: middle;

        &${p}-row-expand-icon-spaced {
          display: inline-block;
          width: 24px;
          height: 24px;
          visibility: hidden;
        }
      }

      & ${p}-row-indent + ${p}-row-expand-icon {
        margin-block: -1px;
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
        & ${p}${p}-outlined {
          & > ${p}-title, & > ${p}-container, & > ${p}-footer {
            border-block: 0;
            border-inline-end: 0;
            border-radius: 0;
            box-shadow: none;
          }

          & > ${p}-title + ${p}-container {
            border-block-start: ${border};
          }

          &:has(> ${p}-footer) > ${p}-container {
            border-block-end: ${border};
          }
        }
      }

      &${p}-outlined ${p}-tbody > tr > td > ${p}-expanded-row-fixed {
        margin-inline: calc((var(${PADDING_INLINE}) + 1px) * -1);
      }

      /* ============================= Summary ============================ */
      & ${p}-summary {
        position: relative;
        z-index: ${Z_FIXED};

        /* See-through; a sticky summary is a sticky holder and gets its frost there. */
        background: transparent;

        & > tr > th,
        & > tr > td {
          border-block-end: ${border};
        }
      }

      & div${p}-summary {
        box-shadow: 0 -1px 0 ${borderColor};
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

          /* Virtual rows are locked to the listItemHeight estimate (an integer). Measured
             heights then equal the estimate, so a rowSpan cell (height = summed row sizes)
             ends exactly on the neighbour rows' divider instead of drifting by sub-pixel
             rounding or unmeasured-row estimates. */
          &:not(${p}-row-extra, ${p}-expanded-row) {
            height: var(--lobe-table-virtual-row-height);
          }

          & > ${p}-cell {
            align-content: center;
          }
        }

        & ${p}-cell {
          border-block-end: ${border};
          background: ${cellBg};
          transition: background-color ${cssVar.motionDurationMid};
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
