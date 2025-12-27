import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
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
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    `,
    handlerIcon: css`
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ${cssVar.motionEaseOut};
    `,
    header: css`
      padding-block: 8px;
      padding-inline: 16px;
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};
      font-weight: 500;
    `,
  };
});
