import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    center: css`
      position: relative;
      overflow: hidden;
    `,
    container: css`
      position: absolute;
      z-index: 10;

      overflow: hidden;
      grid-area: header;
      align-self: stretch;

      width: 100%;
      height: 52px;
      min-height: 52px;
      max-height: 52px;
      border-block-end: 1px solid ${cssVar.colorBorderSecondary};

      background: ${cssVar.colorBgContainer};
    `,
    left: css`
      position: relative;
      overflow: hidden;
      flex: 1;
      padding-inline-start: 8px;
    `,
    right: css`
      position: relative;
      overflow: hidden;
      flex: none;
    `,
  };
});

export const titleStyles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    position: relative;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
  `,
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
    align-items: baseline;
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
    line-height: 1;
  `,
  titleWithDesc: css`
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
