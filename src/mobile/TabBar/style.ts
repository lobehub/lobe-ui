import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: css`
      color: ${cssVar.colorPrimary};
    `,
    container: css`
      user-select: none;

      overflow: hidden;
      flex: none;

      width: 100vw;
      border-block-start: 1px solid ${cssVar.colorFillTertiary};

      background: ${cssVar.colorBgLayout};
    `,

    icon: css`
      width: 24px;
      height: 24px;
      font-size: 24px;
    `,
    inner: css`
      position: relative;
      width: 100%;
      height: 48px;
    `,
    tab: css`
      cursor: pointer;
      width: 48px;
      height: 48px;
      color: ${cssVar.colorTextDescription};
    `,
    title: css`
      overflow: hidden;

      width: 100%;
      margin-block-start: -0.125em;

      font-size: 12px;
      line-height: 1.125em;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  };
});
