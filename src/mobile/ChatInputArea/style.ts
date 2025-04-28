import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      flex: none;
      padding-block: 12px;
      background: ${token.colorFillQuaternary};
      border-block-start: 1px solid ${token.colorFillTertiary};
    `,
    expand: css`
      position: absolute;
      width: 100%;
      height: 100%;
    `,
    expandButton: css`
      position: absolute;
      inset-inline-end: 14px;
    `,
    expandTextArea: css`
      flex: 1;
    `,
    inner: css`
      height: inherit;
      padding-block: 0;
      padding-inline: 8px;
    `,
  };
});
