import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    center: css`
      height: 100%;
    `,
    container: css`
      overflow: hidden;
      flex: none;
      width: 100vw;
      background: ${cssVar.colorBgLayout};
    `,

    inner: css`
      position: relative;

      width: 100%;
      height: 44px;
      min-height: 44px;
      max-height: 44px;
      padding-block: 0;
      padding-inline: 6px;
    `,
    left: css`
      justify-content: flex-start;
      height: 100%;
    `,
    right: css`
      justify-content: flex-end;
      height: 100%;
    `,
  };
});

export const titleStyles = createStaticStyles(({ css, cssVar }) => ({
  desc: css`
    overflow: hidden;

    width: 100%;

    font-size: 12px;
    line-height: 1;
    color: ${cssVar.colorTextTertiary};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  tag: css`
    flex: none;
  `,
  title: css`
    overflow: hidden;

    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  titleContainer: css`
    flex: 1;
  `,
  titleWithDesc: css`
    overflow: hidden;

    font-weight: bold;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
