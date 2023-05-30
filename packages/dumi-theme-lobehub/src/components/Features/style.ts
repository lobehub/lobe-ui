import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, prefixCls, responsive, css, cx }) => {
  const prefix = `${prefixCls}-features`;

  return {
    container: cx(
      prefix,
      css`
        display: grid;
        grid-auto-flow: row dense;
        grid-auto-rows: 24px;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;

        max-width: ${token.contentMaxWidth}px;

        ${responsive({
          mobile: css`
            display: flex;
            flex-direction: column;
          `,
          laptop: {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        })}
      `,
    ),
  };
});
