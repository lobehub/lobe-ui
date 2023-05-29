import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode, stylish }) => {
  return {
    markdown: stylish.markdown,

    code: css`
      padding: 2px 4px;
      font-family: ${token.fontFamilyCode} !important;
      color: ${isDarkMode ? token.cyan8 : token.pink7};
      border-radius: 4px;
    `,
  };
});
