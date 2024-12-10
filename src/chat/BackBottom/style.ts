import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, css, stylish, cx, responsive }, visible: boolean) =>
  cx(
    stylish.blur,
    css`
      pointer-events: ${visible ? 'all' : 'none'};

      position: absolute;
      inset-block-end: 16px;
      inset-inline-end: 16px;
      transform: translateY(${visible ? 0 : '16px'});

      padding-inline: 12px !important;

      opacity: ${visible ? 1 : 0};
      background: ${rgba(token.colorBgContainer, 0.5)};
      border-color: ${token.colorFillTertiary} !important;
      border-radius: 16px !important;

      ${responsive.mobile} {
        inset-inline-end: 0;
        border-inline-end: none;
        border-start-end-radius: 0 !important;
        border-end-end-radius: 0 !important;
      }
    `,
  ),
);
