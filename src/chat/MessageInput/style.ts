import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(
  ({ css, cssVar }) => css`
    position: relative;

    height: 100%;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 13px;
    line-height: 1.8;
  `,
);
