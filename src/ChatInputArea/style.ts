import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding: 12px 0 16px;
    `,
    actionsBar: css`
      display: flex;
      flex: none;
      align-items: center;
      justify-content: space-between;

      padding: 0 16px;
    `,
    actionLeft: css`
      display: flex;
      flex: 1;
      gap: 4px;
      align-items: center;
      justify-content: flex-start;
    `,
    actionsRight: css`
      display: flex;
      flex: 0;
      gap: 4px;
      align-items: center;
      justify-content: flex-end;
    `,
    textarea: css`
      flex: 1;
      padding: 0 24px;
    `,
    footerBar: css`
      display: flex;
      flex: none;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;

      padding: 0 24px;
    `,
  };
});
