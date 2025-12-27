import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(
  ({ css, cssVar }) => css`
    width: 58px;
    height: 100%;
    min-height: 640px;
    padding-block: 12px;
    padding-inline: 0;
    border-inline-end: 1px solid ${cssVar.colorBorderSecondary};

    background: ${cssVar.colorBgContainer};
  `,
);
