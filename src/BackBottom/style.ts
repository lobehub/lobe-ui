import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ token, css, stylish, cx, responsive }, visible: boolean) =>
  cx(
    stylish.blur,
    css`
      pointer-events: ${visible ? 'all' : 'none'};

      position: absolute;
      right: 16px;
      bottom: 16px;
      transform: translateY(${visible ? 0 : '16px'});

      padding-inline: 12px !important;

      opacity: ${visible ? 1 : 0};
      background: ${rgba(token.colorBgContainer, 0.5)};
      border-color: ${token.colorFillTertiary} !important;
      border-radius: 16px !important;

      ${responsive.mobile} {
        right: 0;
        border-right: none;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
    `,
  ),
);
