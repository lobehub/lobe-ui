import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ prefixCls, responsive, css, cx }, contentMaxWidth: number) => {
    const prefix = `${prefixCls}-features`;

    return {
      container: cx(
        prefix,
        css`
          display: grid;
          grid-auto-flow: row dense;
          grid-auto-rows: 18px;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;

          max-width: ${contentMaxWidth}px;

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
  },
);
