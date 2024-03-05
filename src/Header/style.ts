import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, responsive, token, cx }) => ({
  content: css`
    height: 64px;
    padding-block: 0;
    padding-inline: 24px;

    background-color: ${rgba(token.colorBgLayout, 0.4)};
    border-block-end: 1px solid ${token.colorSplit};

    ${responsive.mobile} {
      padding-block: 0;
      padding-inline: 12px;
    }
  `,
  header: cx(css`
    grid-area: head;
    align-self: stretch;
    width: 100%;
  `),
  left: css`
    z-index: 10;
  `,
  right: css`
    z-index: 10;

    &-aside {
      display: flex;
      align-items: center;

      ${responsive.mobile} {
        justify-content: center;

        margin-block: 8px;
        margin-inline: 16px;
        padding-block-start: 24px;

        border-block-start: 1px solid ${token.colorBorder};
      }
    }
  `,
}));
