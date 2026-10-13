import { createStaticStyles } from 'antd-style';

/**
 * A content card sitting on the workspace.
 *
 * Outlined `Block` uses `colorBorderSecondary` on `colorBgContainer`.
 * The workspace is already that container, so a card inside it steps up to
 * `colorBgElevated` and `colorBorder`.
 */
export const styles = createStaticStyles(({ css, cssVar }) => ({
  card: css`
    &&,
    &&:hover {
      border: 1px solid ${cssVar.colorBorder};
      border-radius: ${cssVar.borderRadiusLG};
      background: ${cssVar.colorBgElevated};
      box-shadow: ${cssVar.boxShadowTertiary};
    }
  `,
  chart: css`
    min-inline-size: 0;
  `,
  /** Rounded corners clip a bled table, header rule, or chart. Bare cards keep overflow visible. */
  clip: css`
    overflow: hidden;
  `,
  loading: css`
    padding-block: 4px 8px;
  `,
  arrow: css`
    flex: none;

    margin-block-start: 2px;
    margin-inline-start: auto;

    color: ${cssVar.colorTextTertiary};

    transition:
      color 150ms ease-out,
      transform 150ms ease-out;
  `,
  bleed: css`
    && th,
    && td {
      padding-inline: 16px;
    }

    && th {
      white-space: nowrap;
    }
  `,
  body: css`
    --surface-pad-inline: 16px;
    --surface-pad-block: 16px;

    padding: 16px;
  `,
  /** Table and header rules for the rich card. Kept off `card` so the shared class stays a plain frame. */
  content: css`
    min-inline-size: 0;

    /* Table cells default to colorBgContainer, a step darker than this card.
       Ant Design paints that color on .ant-table itself, so the body stays dark
       even after the cells are cleared. */
    && .ant-table,
    && th,
    && td {
      background: transparent;
    }

    && .ant-table-css-var,
    && .ant-table-wrapper {
      --ant-table-border-color: color-mix(in srgb, ${cssVar.colorText} 10%, transparent);
      --ant-table-row-hover-bg: color-mix(
        in srgb,
        ${cssVar.colorText} 6%,
        ${cssVar.colorBgElevated}
      );
    }

    && th {
      font-weight: 500;
      color: ${cssVar.colorTextSecondary};
      white-space: nowrap;

      background: ${cssVar.colorBgElevated};
      box-shadow: inset 0 -1px 0 color-mix(in srgb, ${cssVar.colorText} 10%, transparent);
    }

    /* Pinned body cells inherit the transparent body, so a scrolled cell paints
       straight through them. Frost with the card color. Header pins stay the
       same solid fill as the rest of the header — a translucent header reads
       as a lighter strip in dark mode. */
    && td.ant-table-cell-fix-start,
    && td.ant-table-cell-fix-end {
      background: color-mix(in srgb, ${cssVar.colorBgElevated} 82%, transparent);
      backdrop-filter: blur(12px);
    }

    && td.ant-table-cell-fix-end-shadow-show::after {
      background: linear-gradient(
        to left,
        color-mix(in srgb, ${cssVar.colorBgElevated} 72%, transparent),
        transparent
      );
      backdrop-filter: blur(8px);
    }

    && td.ant-table-cell-fix-start-shadow-show::after {
      background: linear-gradient(
        to right,
        color-mix(in srgb, ${cssVar.colorBgElevated} 72%, transparent),
        transparent
      );
      backdrop-filter: blur(8px);
    }

    [dir='rtl'] && td.ant-table-cell-fix-end-shadow-show::after {
      background: linear-gradient(
        to right,
        color-mix(in srgb, ${cssVar.colorBgElevated} 72%, transparent),
        transparent
      );
    }

    [dir='rtl'] && td.ant-table-cell-fix-start-shadow-show::after {
      background: linear-gradient(
        to left,
        color-mix(in srgb, ${cssVar.colorBgElevated} 72%, transparent),
        transparent
      );
    }

    && td {
      border-block-end-color: color-mix(in srgb, ${cssVar.colorText} 10%, transparent);
    }

    && tr:hover > td,
    && .ant-table-tbody > tr.ant-table-row:hover > td {
      background: color-mix(in srgb, ${cssVar.colorText} 6%, ${cssVar.colorBgElevated});
    }

    /* base-ui Table pins with inline position:sticky, not .ant-table-cell-fix-*.
       The transparent body rule above would let scrolled text show through. */
    && td[style*='sticky'] {
      background: ${cssVar.colorBgElevated};
    }

    && tr:hover > td[style*='sticky'] {
      background: color-mix(in srgb, ${cssVar.colorText} 6%, ${cssVar.colorBgElevated});
    }
  `,
  /** Whole card answers hover when its header drills into another page. */
  cardLinked: css`
    &&:hover,
    &&:focus-within {
      border-color: color-mix(in srgb, ${cssVar.colorText} 28%, transparent);
    }

    &&:hover [data-surface-arrow] {
      transform: translate(1px, -1px);
      color: ${cssVar.colorText};
    }
  `,
  desc: css`
    margin-block-start: 2px;

    font-size: 13px;
    font-weight: 400;
    line-height: 1.45;
    color: ${cssVar.colorTextSecondary};
  `,
  extra: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    padding-block: 12px;
    padding-inline: 16px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  heading: css`
    min-inline-size: 0;
  `,
  headingLink: css`
    display: flex;
    flex: 1;
    gap: 12px;
    align-items: flex-start;

    min-inline-size: 0;

    color: inherit;
    text-decoration: none;

    &:hover {
      color: inherit;
    }
  `,
  /**
   * A table inside padded card body meets the card's left, right, and bottom
   * edges. A table that is the only body content also meets the header.
   * Padding amounts come from `--surface-pad-*` on the same element.
   */
  tableBleed: css`
    /* A table nested in a cell keeps the cell's own inset. */
    && :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper])) {
      width: calc(100% + 2 * var(--surface-pad-inline, 16px));
      margin-inline: calc(-1 * var(--surface-pad-inline, 16px));
    }

    && :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper])):last-child {
      margin-block-end: calc(-1 * var(--surface-pad-block, 16px));
    }

    && :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper])):first-child:last-child {
      margin-block-start: calc(-1 * var(--surface-pad-block, 16px));
    }

    /* ProTable keeps its search and toolbar in the padding. The table itself
       meets the card's left, right, and bottom edges. Lower-specificity
       selectors stay above the :has(th/td) rules for stylelint. */
    && .ant-table-css-var,
    && .ant-table-wrapper {
      --ant-table-cell-padding-inline: var(--surface-pad-inline, 16px);
      --ant-table-cell-padding-inline-md: var(--surface-pad-inline, 16px);
      --ant-table-cell-padding-inline-sm: var(--surface-pad-inline, 16px);
      --ant-table-header-border-radius: 0;
    }

    && .ant-table-wrapper {
      width: calc(100% + 2 * var(--surface-pad-inline, 16px));
      max-width: none;
      margin-inline: calc(-1 * var(--surface-pad-inline, 16px));
    }

    /* A plain table that is the card body meets the header and the bottom edge.
       Its own corner radius would otherwise float inside the card padding. */
    && > .lobe-flex:only-child > .ant-table-wrapper:only-child {
      margin-block: calc(-1 * var(--surface-pad-block, 16px));
    }

    && .ant-pro-table:last-child {
      margin-block-end: calc(-1 * var(--surface-pad-block, 16px));
    }

    && .ant-table-wrapper .ant-table,
    && .ant-table-wrapper .ant-table-container,
    && .ant-table-thead > tr > th,
    && .ant-table-thead > tr > th:first-child,
    && .ant-table-thead > tr > th:last-child {
      border-radius: 0;
    }

    && .ant-table-wrapper .ant-table-cell {
      padding-inline: var(--surface-pad-inline, 16px);
    }

    && .ant-table-wrapper .ant-pagination {
      margin-block: 0;
      padding-block: 12px;
      padding-inline: var(--surface-pad-inline, 16px);
    }

    && :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper])) th,
    && :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper])) td {
      padding-inline: var(--surface-pad-inline, 16px);
    }

    /* The root's negative bottom margin includes this sibling. Without block
       padding the pager sits on the card edge. Same inset as the ant pagination. */
    &&
      :has(> [data-table-wrapper]):not(td :has(> [data-table-wrapper]))
      > :not([data-table-wrapper]) {
      margin-block: 0;
      padding-block: 12px;
      padding-inline: var(--surface-pad-inline, 16px);
    }
  `,
  title: css`
    overflow: hidden;

    min-inline-size: 0;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
