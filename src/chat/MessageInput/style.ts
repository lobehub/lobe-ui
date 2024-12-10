import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }) => css`
    position: relative;

    height: 100%;

    font-family: ${token.fontFamilyCode};
    font-size: 13px;
    line-height: 1.8;
  `,
);
