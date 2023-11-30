import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ stylish, token, css }) => {
  return {
    image: css`
      overflow: hidden;
      width: 100%;
      height: 100%;

      img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain;
      }
    `,
    imageWrapper: css`
      position: relative;

      overflow: hidden;

      margin-block: 0 1em;

      background: ${rgba(token.colorBgLayout, 0.25)};
      border-radius: ${token.borderRadius}px;
      box-shadow: 0 0 0 1px ${token.colorFillTertiary};
    `,
    markdown: stylish.markdown,
  };
});
