import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyle = createStyles(({ css, responsive, token, cx }) => ({
  header: cx(
    css`
      grid-area: head;
      align-self: stretch;
      width: 100%;
    `,
  ),
  content: css`
    height: 64px;
    padding: 0 24px;
    background-color: ${rgba(token.colorBgLayout, 0.4)};
    border-bottom: 1px solid ${token.colorSplit};

    ${responsive.mobile} {
      padding: 0 12px;
    }
  `,
  left: css`
    z-index: 10;
  `,
  right: css`
    z-index: 10;
    display: flex;
    flex: 1;
    justify-content: space-between;

    &-aside {
      display: flex;
      align-items: center;

      ${responsive.mobile} {
        justify-content: center;
        margin: 8px 16px;
        padding-top: 24px;
        border-top: 1px solid ${token.colorBorder};
      }
    }
  `,
}));
