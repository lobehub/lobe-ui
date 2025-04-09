import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding-block: 12px 16px;
      padding-inline: 0;
    `,
    textarea: css`
      height: 100% !important;
      padding-block: 0;
      padding-inline: 24px;
      line-height: 1.5;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

export const useActionBarStyles = createStyles(({ css, cx, stylish }) => ({
  left: cx(
    stylish.noScrollbar,
    css`
      overflow: auto hidden;
    `,
  ),
  right: css``,
  root: css`
    position: relative;
    overflow: hidden;
    width: 100%;
  `,
}));
