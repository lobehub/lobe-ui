import { createStyles } from 'antd-style';
import { memo } from 'react';

import Highlighter from '@/Highlighter';
import Snippet from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css }) => ({
  container: css`
    :not(:last-child) {
      margin-block: 1em 1em;
      margin-inline: 0 0;
    }
  `,
  highlight: css`
    pre {
      padding: 12px !important;
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

  if (!rest.children[0]) return;

  const { children, className } = rest.children[0].props;

  if (!children) return;

  const content = Array.isArray(children) ? (children[0] as string) : children;
  const lang = className?.replace('language-', '') || FALLBACK_LANG;
  if (countLines(content) === 1 && content.length <= 60) {
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
