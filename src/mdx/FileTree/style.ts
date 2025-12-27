import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-block: 0.75em;
      padding-inline: 1em;
      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);

      color: ${cssVar.colorTextSecondary};

      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
    `,
    folder: css`
      cursor: pointer;

      &:hover {
        color: ${cssVar.colorText};
      }
    `,
    folderChildren: css`
      padding-inline-start: 1em;
    `,
  };
});
