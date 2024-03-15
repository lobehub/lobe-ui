import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, stylish, css },
    { fontSize = 16, headerMultiple = 1 }: { fontSize?: number; headerMultiple?: number },
  ) => {
    return {
      chat: css`
        --lobe-markdown-font-size: 14px;
        --lobe-markdown-header-multiple: 0.25;

        margin-block: -0.75em;
      `,
      markdown: cx(
        stylish.markdown,
        css`
          --lobe-markdown-font-size: ${fontSize}px;
          --lobe-markdown-header-multiple: ${headerMultiple};
        `,
      ),
    };
  },
);
