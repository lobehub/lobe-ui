import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    container: css`
      flex: none;
      padding-block: 12px;
      border-block-start: 1px solid ${cssVar.colorFillTertiary};
      background: ${cssVar.colorFillQuaternary};
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
