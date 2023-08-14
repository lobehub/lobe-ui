import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
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
    textarea: css`
      height: 100% !important;
      padding: 0 24px;
      line-height: 1.5;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});
