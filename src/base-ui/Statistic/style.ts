import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  affix: css`
    font-size: 14px;
    font-weight: 400;
    color: ${cssVar.colorTextSecondary};
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  title: css`
    font-size: 14px;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
  `,
  value: css`
    display: flex;
    gap: 4px;
    align-items: baseline;

    font-size: 24px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
    color: ${cssVar.colorText};
  `,
}));
