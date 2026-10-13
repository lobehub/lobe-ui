import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  cell: css`
    display: flex;
    flex-direction: column;
    gap: 6px;

    min-inline-size: 0;
    padding-block: 16px;
    padding-inline: 20px;

    background: ${cssVar.colorBgElevated};
    box-shadow:
      inset -1px 0 0 var(--metric-seam),
      inset 0 -1px 0 var(--metric-seam);
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
    --metric-seam: color-mix(in srgb, ${cssVar.colorText} 10%, transparent);

    overflow: hidden;
    background: ${cssVar.colorBgElevated};
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

    inline-size: calc(100% + 1px);
    margin-block-end: -1px;

    background: ${cssVar.colorBgElevated};
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
