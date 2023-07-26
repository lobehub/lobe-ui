import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    active: css`
      color: ${token.colorText};
      background-color: ${token.colorFillTertiary};

      &:hover {
        background-color: ${token.colorFill};
      }
    `,
    container: css`
      cursor: pointer;
      color: ${token.colorTextTertiary};
      transition: background-color 200ms ${token.motionEaseOut};

      &:active {
        background-color: ${token.colorFill} !important;
      }

      &:hover {
        background-color: ${token.colorFillSecondary};
      }
    `,
    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
    `,
    desc: css`
      overflow: hidden;

      width: 100%;
      margin-top: 2px;

      font-size: 12px;
      color: ${token.colorTextDescription};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,

    inner: css`
      transition: scale 400ms ${token.motionEaseOut};

      &:active {
        scale: 0.95;
      }
    `,

    time: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,
    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 16px;
      color: ${token.colorText};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  };
});
