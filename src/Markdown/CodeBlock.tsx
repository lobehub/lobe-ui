import { createStyles } from 'antd-style';
import { memo } from 'react';

import Highlighter from '@/Highlighter';
import Snippet from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-block: 1em;
    border-radius: ${token.borderRadius}px;
    box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};
  `,
  highlight: css`
    pre {
      padding: 1em !important;
    }
  `,
}));

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

const Code = memo(({ fullFeatured, ...rest }: any) => {
  const { styles, cx } = useStyles();

  console.log(rest);

  if (!rest.children[0]) return;

  const { children, className } = rest.children[0].props;

  if (!children) return;

  let content = Array.isArray(children) ? (children[0] as string) : children;

  content = content.trim();

  const lang = className?.replace('language-', '') || FALLBACK_LANG;
  if (countLines(content) <= 1 && content.length <= 60) {
    return (
      <Snippet
        className={styles.container}
        data-code-type="highlighter"
        language={lang}
        type={'block'}
      >
        {content}
      </Snippet>
    );
  }

  return (
    <Highlighter
      className={cx(styles.container, styles.highlight)}
      copyButtonSize={{ blockSize: 28, fontSize: 16 }}
      fullFeatured={fullFeatured}
      language={lang}
      type="block"
    >
      {content}
    </Highlighter>
  );
});

export const CodeLite = memo((props: any) => {
  return <Code {...props} />;
});

export const CodeFullFeatured = memo((props: any) => {
  return <Code fullFeatured {...props} />;
});
