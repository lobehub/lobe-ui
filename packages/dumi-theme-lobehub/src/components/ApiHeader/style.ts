import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, responsive: r, stylish }) => ({
  title: css`
    ${r.mobile} {
      margin-block: 0;
      font-size: 32px !important;
    }
  `,
  label: css`
    width: 80px;
  `,
  desc: css`
    font-size: ${token.fontSizeLG}px;
    line-height: ${token.lineHeightLG}px;
  `,
  text: css`
    ${stylish.resetLinkColor}
  `,
  meta: css``,
}));
