import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    body: css`
      overflow: hidden auto;
      padding: 16px;
    `,
    container: css`
      position: relative;
      overflow: hidden;
    `,
    footer: css`
      padding-block: 8px;
      padding-inline: 16px;
      border-block-start: 1px solid ${token.colorBorderSecondary};
    `,
    handlerIcon: css`
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ${token.motionEaseOut};
    `,
    header: css`
      padding-block: 8px;
      padding-inline: 16px;
      font-weight: 500;
      border-block-end: 1px solid ${token.colorBorderSecondary};
    `,
  };
});
