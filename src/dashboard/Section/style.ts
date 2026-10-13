import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  desc: css`
    font-size: 13px;
    font-weight: 400;
    line-height: 1.45;
    color: ${cssVar.colorTextSecondary};
  `,
  more: css`
    display: inline-flex;
    gap: 2px;
    align-items: center;

    font-size: 13px;
    color: ${cssVar.colorTextSecondary};
    text-decoration: none;

    &:hover {
      color: ${cssVar.colorText};
    }
  `,
  title: css`
    margin: 0;

    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    color: ${cssVar.colorText};
  `,
}));
