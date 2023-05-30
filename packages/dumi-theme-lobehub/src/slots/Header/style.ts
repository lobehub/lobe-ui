import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyle = createStyles(({ css, responsive, token, stylish, cx }) => ({
  header: cx(
    stylish.blur,
    css`
      position: fixed;
      z-index: ${token.zIndexPopupBase - 50};
      top: 0;

      grid-area: head;
      align-self: stretch;

      width: 100%;

      background-color: ${rgba(token.colorBgLayout, 0.4)};
      border-bottom: 1px solid ${token.colorSplit};
    `,
  ),
  content: css`
    height: 64px;
    padding: 0 24px;

    ${responsive.mobile} {
      padding: 0 12px;
    }
  `,
  left: css``,
  right: css`
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
