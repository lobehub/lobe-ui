import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, pin: boolean) => {
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
      background: ${pin ? token.colorFillTertiary : 'transparent'};
      transition: background-color 200ms ${token.motionEaseOut};

      &:active {
        background-color: ${pin ? token.colorFill : token.colorFillSecondary} !important;
      }

      &:hover {
        background-color: ${pin ? token.colorFill : token.colorFillTertiary};
      }
    `,
    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
      padding-top: 6px;
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
      background-color: ${token.colorFillTertiary};
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
  };
});
