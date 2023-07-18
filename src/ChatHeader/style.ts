import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, stylish, cx }) => {
  return {
    container: cx(
      stylish.blurStrong,
      css`
        position: absolute;
        z-index: 10;

        grid-area: header;
        align-self: stretch;

        width: 100%;
        height: 64px;

        background: linear-gradient(
          to bottom,
          ${rgba(token.colorBgLayout, 0.8)},
          ${rgba(token.colorBgLayout, 0.4)}
        );
        border-bottom: 1px solid ${token.colorSplit};
      `,
    ),
  };
});
