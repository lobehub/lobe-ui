import { createStaticStyles } from 'antd-style';

export const HEADER_HEIGHT = 56;
export const FOOTER_HEIGHT = 68;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    content: css`
      [class*='ant-modal-footer'] {
        margin: 0;
        padding: 16px;
      }

      [class*='ant-modal-header'] {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;

        height: 56px;
        margin-block-end: 0;
        padding: 16px;
      }

      [class*='ant-modal-container'] {
        overflow: hidden;
        padding: 0;
        border: 1px solid ${cssVar.colorSplit};
        border-radius: ${cssVar.borderRadiusLG};
      }
    `,
    drawerContent: css`
      [class*='ant-drawer-close'] {
        padding: 0;
      }

      [class*='ant-drawer-header'] {
        flex: none;
        height: ${HEADER_HEIGHT}px !important;
        padding-block: 0;
        padding-inline: 16px;
      }

      [class*='ant-drawer-footer'] {
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
