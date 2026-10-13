import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  cell: css`
    cursor: pointer;

    position: relative;

    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;

    min-inline-size: 0;
    margin: 0;
    padding-block: 14px 16px;
    padding-inline: 16px;
    border: 0;

    font: inherit;
    color: inherit;
    text-align: start;

    background: transparent;
    box-shadow:
      inset -1px 0 0 var(--filter-seam),
      inset 0 -1px 0 var(--filter-seam);

    &::after {
      content: '';

      position: absolute;
      inset-block-end: 1px;
      inset-inline: 0;

      block-size: 3px;

      background: transparent;
    }

    &:hover {
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  cellActive: css`
    background: ${cssVar.colorFillTertiary};

    &::after {
      background: ${cssVar.colorText};
    }

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  count: css`
    font-size: ${cssVar.fontSizeHeading4};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.15;
    color: ${cssVar.colorText};
  `,
  countDanger: css`
    color: ${cssVar.colorError};
  `,
  countWarning: css`
    color: ${cssVar.colorWarning};
  `,
  frame: css`
    --filter-seam: ${cssVar.colorBorderSecondary};

    overflow: hidden;
    border-radius: inherit;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
    inline-size: calc(100% + 1px);
    margin-block-end: -1px;
  `,
  label: css`
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    color: ${cssVar.colorTextSecondary};
  `,
  labelActive: css`
    color: ${cssVar.colorText};
  `,
}));
