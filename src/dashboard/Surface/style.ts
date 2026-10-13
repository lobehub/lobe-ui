import { createStaticStyles } from 'antd-style';

/**
 * A content card sitting on the workspace.
 *
 * Backgrounds: light mode uses `colorBgContainer`. Dark mode uses the translucent
 * `colorFillTertiary` (white 6%): on the #0d0d0d workspace it reads as about #1c1c1c, a subtle
 * raised step. `colorFillQuaternary` (white 2%, about #111) would barely separate from the page.
 *
 * Borders and inner dividers (table, header and cell lines, PageSkeleton, strip seams) all use the
 * outer border token `colorBorderSecondary` (light and dark); hover and focus use the stronger
 * `colorFill`. The card follows Block: light is Block `outlined` (`colorBgContainer` +
 * `colorBorderSecondary`), dark uses the Block `filled` background (`colorFillTertiary`) with the
 * same `colorBorderSecondary` border.
 *
 * Anything that must hide content scrolled beneath it (table header cells, pinned and sticky
 * cells, their scroll shadows) uses `--lobe-surface-bg-solid`: the same white 6% blended onto
 * `--lobe-surface-canvas` (default `colorBgContainer`, the ConsoleShell workspace). `color-mix`
 * in srgb with an opaque base is plain alpha compositing, so it matches the translucent card.
 * Set `--lobe-surface-canvas` when a card sits on another page color.
 *
 * A Surface inside another Surface (`useSurfaceDepth() > 0`) drops its own fill so fills do not
 * stack. Row hover backgrounds keep their own mix. Layout containers (ConsoleShell, ConsoleNav,
 * FilterSidebar split divider, AuthLayout page canvas) keep their own tokens.
 *
 * Apply the card with `useSurfaceCardClassName()`; plain `surfaceStyles.card` is the light look.
 */
export const styles = createStaticStyles(({ css, cssVar }) => ({
  card: css`
    --lobe-surface-bg: ${cssVar.colorBgContainer};
    --lobe-surface-bg-solid: ${cssVar.colorBgContainer};

    &&,
    &&:hover {
      border: 1px solid ${cssVar.colorBorderSecondary};
      border-radius: ${cssVar.borderRadiusLG};
      background: var(--lobe-surface-bg);
      box-shadow: rgb(0 0 0 / 4%) 0 1px 2px 0;
    }
  `,
  cardDark: css`
    &&& {
      --lobe-surface-bg: ${cssVar.colorFillTertiary};

      /* colorFillTertiary is white 6% in dark; blend the same amount onto the page. */
      --lobe-surface-bg-solid: color-mix(
        in srgb,
        #fff 6%,
        var(--lobe-surface-canvas, ${cssVar.colorBgContainer})
      );

      /* Border: Block's border token (colorBorderSecondary) in both modes, from \`card\`. */
    }
  `,
  cardNested: css`
    &&&,
    &&&:hover {
      background: transparent;
    }
  `,
  chart: css`
    min-inline-size: 0;
  `,
  /**
   * Rounded corners clip whatever reaches the edge: a bled table, header rule, chart, or a
   * tab / segmented indicator. \`clip\` (not \`hidden\`) creates no scroll container, so sticky
   * table headers keep sticking to the page scroller; popups are portaled and unaffected.
   */
  clip: css`
    overflow: clip;
  `,
  loading: css`
    padding-block: 4px 8px;
  `,
  arrow: css`
    flex: none;

    margin-block-start: 8px;
    margin-inline-start: auto;

    color: ${cssVar.colorTextTertiary};

    transition:
      color 150ms ease-out,
      transform 150ms ease-out;
  `,
  arrowLink: css`
    display: flex;
    flex: none;
    align-items: center;
    color: inherit;

    & [data-surface-arrow] {
      margin-block-start: 0;
    }
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

    /* Ant Design paints its own container color on .ant-table and the cells.
       Clear it so the card background shows through; the card owns the fill. */
    && .ant-table,
    && th,
    && td {
      background: transparent;
    }

    && .ant-table-css-var,
    && .ant-table-wrapper {
      --ant-table-border-color: ${cssVar.colorBorderSecondary};
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

      background: var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer});
      box-shadow: inset 0 -1px 0 ${cssVar.colorBorderSecondary};
    }

    /* Pinned body cells inherit the transparent body, so a scrolled cell paints
       straight through them. Frost with the card color. Header pins stay the
       same solid fill as the rest of the header — a translucent header reads
       as a lighter strip in dark mode. */
    && td.ant-table-cell-fix-start,
    && td.ant-table-cell-fix-end {
      background: var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer});
      backdrop-filter: blur(12px);
    }

    && td.ant-table-cell-fix-end-shadow-show::after {
      background: linear-gradient(
        to left,
        color-mix(
          in srgb,
          var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer}) 72%,
          transparent
        ),
        transparent
      );
      backdrop-filter: blur(8px);
    }

    && td.ant-table-cell-fix-start-shadow-show::after {
      background: linear-gradient(
        to right,
        color-mix(
          in srgb,
          var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer}) 72%,
          transparent
        ),
        transparent
      );
      backdrop-filter: blur(8px);
    }

    [dir='rtl'] && td.ant-table-cell-fix-end-shadow-show::after {
      background: linear-gradient(
        to right,
        color-mix(
          in srgb,
          var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer}) 72%,
          transparent
        ),
        transparent
      );
    }

    [dir='rtl'] && td.ant-table-cell-fix-start-shadow-show::after {
      background: linear-gradient(
        to left,
        color-mix(
          in srgb,
          var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer}) 72%,
          transparent
        ),
        transparent
      );
    }

    && td {
      border-block-end-color: ${cssVar.colorBorderSecondary};
    }

    && tr:hover > td,
    && .ant-table-tbody > tr.ant-table-row:hover > td {
      background: color-mix(in srgb, ${cssVar.colorText} 6%, ${cssVar.colorBgElevated});
    }

    /* base-ui Table pins with inline position:sticky, not .ant-table-cell-fix-*.
       The transparent body rule above would let scrolled text show through. */
    && td[style*='sticky'] {
      background: var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer});
    }

    && tr:hover > td[style*='sticky'] {
      background: color-mix(in srgb, ${cssVar.colorText} 6%, ${cssVar.colorBgElevated});
    }
  `,
  /** Whole card answers hover when its header drills into another page. */
  cardLinked: css`
    &&:hover,
    &&:focus-within {
      border-color: ${cssVar.colorFill};
    }

    &&:hover [data-surface-arrow] {
      transform: translate(1px, -1px);
      color: ${cssVar.colorText};
    }
  `,
  desc: css`
    margin-block-start: -4px;

    font-size: 13px;
    font-weight: 400;
    line-height: 1.45;
    color: ${cssVar.colorTextSecondary};
  `,
  /* One fixed control row (32px, the height of a small Segmented or a default ActionIcon), so a
     header with controls is exactly as tall as one without, and the controls sit centered with
     8px clear above the divider. */
  extra: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;

    block-size: 32px;
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;

    box-sizing: border-box;
    min-block-size: 48px;
    padding-block: 8px;
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

    /* The title line is the 32px control row; extra and the arrow center on it, and a
       description adds its own line below without moving them. */
    line-height: 32px;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
