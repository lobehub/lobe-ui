import { createStyles } from 'antd-style';

export const HEADER_HEIGHT = 56;
export const FOOTER_HEIGHT = 68;

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    content: css`
      .${prefixCls}-modal-footer {
        margin: 0;
        padding: 16px;
      }
      .${prefixCls}-modal-header {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;

        height: 56px;
        margin-block-end: 0;
        padding: 16px;
      }
      .${prefixCls}-modal-content {
        overflow: hidden;
        padding: 0;
        border: 1px solid ${token.colorSplit};
        border-radius: ${token.borderRadiusLG}px;
      }
    `,
    drawerContent: css`
      .${prefixCls}-drawer-close {
        padding: 0;
      }

      .${prefixCls}-drawer-header {
        flex: none;
        height: ${HEADER_HEIGHT}px !important;
        padding-block: 0;
        padding-inline: 16px;
      }

      .${prefixCls}-drawer-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        padding: 16px;

        border: none;
      }
    `,
    wrap: css`
      overflow: hidden auto;
    `,
  };
});
