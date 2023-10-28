import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    actions: css`
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
    `,
    active: css`
      color: ${token.colorText};
      background-color: ${token.colorFillSecondary};

      &:hover {
        background-color: ${token.colorFill};
      }
    `,
    container: css`
      cursor: pointer;
      color: ${token.colorTextTertiary};
      background: transparent;
      transition: background-color 200ms ${token.motionEaseOut};

      &:active {
        background-color: ${token.colorFillSecondary};
      }

      &:hover {
        background-color: ${token.colorFillTertiary};
      }
    `,
    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
      align-self: center;
    `,
    desc: css`
      overflow: hidden;

      width: 100%;

      font-size: 12px;
      line-height: 1;
      color: ${token.colorTextDescription};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,

    pin: css`
      position: absolute;
      top: 6px;
      right: 6px;
    `,
    time: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,

    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 16px;
      line-height: 1;
      color: ${token.colorText};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    triangle: css`
      width: 10px;
      height: 10px;

      opacity: 0.5;
      background: ${token.colorPrimaryBorder};
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
      border-radius: 2px;
    `,
  };
});
