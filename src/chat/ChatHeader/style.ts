import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, stylish, cx }) => {
  return {
    center: css`
      position: relative;
      overflow: hidden;
    `,
    container: cx(
      stylish.blurStrong,
      css`
        position: absolute;
        z-index: 10;

        overflow: hidden;
        grid-area: header;
        align-self: stretch;

        width: 100%;
        height: 52px;
        min-height: 52px;
        max-height: 52px;
        border-block-end: 1px solid ${token.colorBorderSecondary};

        background: linear-gradient(
          to bottom,
          ${rgba(token.colorBgLayout, 0.8)},
          ${rgba(token.colorBgLayout, 0.4)}
        );
      `,
    ),
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

export const useTitleStyles = createStyles(({ css, token }) => ({
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
    color: ${token.colorTextTertiary};
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
