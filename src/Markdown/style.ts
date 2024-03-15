import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css },
    {
      fontSize = 14,
      headerMultiple = 0.25,
      marginMultiple = 1,
      lineHeight = 1.6,
    }: { fontSize?: number; headerMultiple?: number; lineHeight?: number; marginMultiple?: number },
  ) => {
    return {
      chat: css`
        --lobe-markdown-font-size: ${fontSize}px;
        --lobe-markdown-header-multiple: ${headerMultiple};
        --lobe-markdown-margin-multiple: ${marginMultiple};
        --lobe-markdown-line-height: ${lineHeight};

        margin-block: ${marginMultiple * -0.75}em;
      `,
    };
  },
);
