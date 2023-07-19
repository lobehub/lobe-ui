import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    actionLeft: css`
      display: flex;
      flex: 1;
      gap: 4px;
      align-items: center;
      justify-content: flex-start;
    `,
    actionsBar: css`
      display: flex;
      flex: none;
      align-items: center;
      justify-content: space-between;

      padding: 0 16px;
    `,
    actionsRight: css`
      display: flex;
      flex: 0;
      gap: 4px;
      align-items: center;
      justify-content: flex-end;
    `,
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding: 12px 0 16px;
    `,
    footerBar: css`
      display: flex;
      flex: none;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;

      padding: 0 24px;
    `,
    highlight: css`
      pointer-events: none;

      position: absolute;
      inset: 0;

      overflow-x: hidden;
      overflow-y: auto;

      padding: 0 24px;

      .shiki {
        margin: 0;
      }

      pre {
        font-family: ${token.fontFamilyCode} !important;
        line-height: 1.5;
        color: ${token.colorSuccess};
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    `,
    textarea: css`
      height: 100% !important;
      padding: 0 24px;

      font-family: ${token.fontFamilyCode} !important;
      line-height: 1.5;
      color: transparent;

      caret-color: ${token.colorText};
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});
