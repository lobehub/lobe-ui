import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  cell: css`
    display: flex;
    flex-direction: column;
    gap: 6px;

    min-inline-size: 0;
    padding-block: 16px;
    padding-inline: 20px;

    background: transparent;
  `,
  /** Joined strip only: the divider on the cell's trailing and bottom edges. */
  cellSeam: css`
    box-shadow:
      inset -1px 0 0 var(--metric-seam),
      inset 0 -1px 0 var(--metric-seam);
  `,
  /** Split strip and StatCard: one card per item. */
  card: css`
    display: grid;
    min-inline-size: 0;
  `,
  /* One fixed 32px row (a small Segmented or ActionIcon fits): an action or mark in the head must not push the value down, so cells with and
     without header controls line up across a split strip or a row of StatCards. */
  head: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;

    box-sizing: border-box;
    min-inline-size: 0;
    block-size: 32px;
  `,
  headCopy: css`
    display: flex;
    flex: 1;
    gap: 6px;
    align-items: center;

    min-inline-size: 0;
  `,
  /** Label-row control, pushed to the trailing edge. */
  headAction: css`
    display: flex;
    flex: none;
    align-items: center;
  `,
  /** Full-width chart slot under the delta and hint. */
  chart: css`
    inline-size: 100%;
    min-inline-size: 0;
    margin-block-start: 6px;
  `,
  mark: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    inline-size: 24px;
    block-size: 24px;
    border: 1px solid ${cssVar.colorFillSecondary};
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: ${cssVar.colorFillTertiary};
  `,
  split: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  `,
  delta: css`
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
  `,
  deltaDown: css`
    color: ${cssVar.colorError};
  `,
  deltaFlat: css`
    color: ${cssVar.colorTextSecondary};
  `,
  deltaUp: css`
    color: ${cssVar.colorSuccess};
  `,
  foot: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: baseline;
  `,
  /**
   * Clips the seam that would otherwise sit on the card's trailing and bottom
   * edges. A short last row used to show the seam color across the empty
   * track, which reads louder than the cells.
   */
  frame: css`
    --metric-seam: ${cssVar.colorBorderSecondary};

    overflow: hidden;
    border-radius: inherit;
    background: transparent;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

    inline-size: calc(100% + 1px);
    margin-block-end: -1px;

    background: transparent;
  `,
  hint: css`
    font-size: 13px;
    line-height: 1.4;
    color: ${cssVar.colorTextSecondary};
  `,
  label: css`
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    color: ${cssVar.colorTextSecondary};
  `,
  link: css`
    color: inherit;
    text-decoration: none;

    &:hover {
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  press: css`
    cursor: pointer;

    border: none;

    font: inherit;
    color: inherit;
    text-align: start;

    &:hover {
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  /** Grid cell around a rendered link, so the link fills it. */
  slot: css`
    display: grid;
    min-inline-size: 0;
  `,
  value: css`
    overflow: hidden;

    font-size: ${cssVar.fontSizeHeading3};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.15;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  valueDanger: css`
    color: ${cssVar.colorError};
  `,
  valueWarning: css`
    color: ${cssVar.colorWarning};
  `,
}));
