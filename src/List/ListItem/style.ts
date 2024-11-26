import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    actions: css`
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: 16px;
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

      position: relative;

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
      width: 100%;
      margin: 0 !important;

      font-size: 12px;
      line-height: 1.2 !important;
      color: ${token.colorTextDescription};
    `,

    pin: css`
      position: absolute;
      inset-block-start: 6px;
      inset-inline-end: 6px;
    `,
    time: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,

    title: css`
      width: 100%;
      margin: 0 !important;

      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.2 !important;
      color: ${token.colorText};
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
