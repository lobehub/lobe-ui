import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    avatar: css`
      border: 2px solid ${cssVar.colorBgContainer} !important;
    `,
    count: css`
      font-size: 0.8em;
      color: ${cssVar.colorBgLayout};
    `,
  };
});
