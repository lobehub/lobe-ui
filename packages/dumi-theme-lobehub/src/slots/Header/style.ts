import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyle = createStyles(({ css, responsive, token }) => ({
  header: css`
    top: 0;
    position: fixed;
    width: 100%;
    background-color: ${rgba(token.colorBgLayout, 0.5)};
    backdrop-filter: saturate(180%) blur(10px);
    z-index: ${token.zIndexPopupBase - 50};
    border-bottom: 1px solid ${token.colorSplit};

    grid-area: head;
    align-self: stretch;

    ${responsive.mobile} {
      background-color: ${rgba(token.colorBgLayout, 0.8)};
    }
  `,
  content: css`
    padding: 0 24px;
    height: 64px;

    ${responsive.mobile} {
      padding: 0 12px;
    }
  `,
  left: css``,
  right: css`
    flex: 1;
    display: flex;
    justify-content: space-between;

    &-aside {
      display: flex;
      align-items: center;

      ${responsive.mobile} {
        margin: 8px 16px;
        padding-top: 24px;
        justify-content: center;
        border-top: 1px solid ${token.colorBorder};
      }
    }
  `,
}));
