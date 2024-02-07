import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  close: css`
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
  `,
  container: css`
    position: relative;

    overflow: hidden;

    background: linear-gradient(
      to bottom,
      ${isDarkMode ? token.colorBgElevated : token.colorBgLayout},
      ${token.colorBgContainer}
    );
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadius}px;
  `,
  content: css`
    padding-block: 0 16px;
    padding-inline: 16px;
  `,
  desc: css`
    color: ${token.colorTextDescription};
  `,
  image: css`
    align-self: center;
  `,
}));
