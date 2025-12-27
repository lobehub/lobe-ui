import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    display: inline-flex;
    line-height: var(--lobe-markdown-line-height);
    vertical-align: baseline;

    a {
      color: inherit;
    }
  `,
  link: css`
    cursor: pointer;
    color: ${cssVar.colorTextSecondary};

    :hover {
      color: ${cssVar.colorText};
    }
  `,
  supContainer: css`
    vertical-align: super;
  `,
  url: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    max-width: 400px;

    text-overflow: ellipsis;
  `,
}));
