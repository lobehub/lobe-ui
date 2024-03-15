import { memo } from 'react';

import { FALLBACK_LANG } from '@/hooks/useHighlight';

import Pre, { PreSingleLine } from '../mdx/Pre';

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

const useCode = (raw: any) => {
  if (!raw) return;

  const { children, className } = raw.props;

  if (!children) return;

  const content = Array.isArray(children) ? (children[0] as string) : children;

  const lang = className?.replace('language-', '') || FALLBACK_LANG;

  const isSingleLine = countLines(content) <= 1 && content.length <= 6;

  return {
    content,
    isSingleLine,
    lang,
  };
};

const CodeBlock = memo(({ fullFeatured, ...rest }: any) => {
  const code = useCode(rest?.children?.[0]);

  if (!code) return;

  if (code.isSingleLine) return <PreSingleLine lang={code.lang}>{code.content}</PreSingleLine>;

  return (
    <Pre fullFeatured={fullFeatured} lang={code.lang}>
      {code.content}
    </Pre>
  );
});

export const CodeLite = memo((props: any) => {
  return <CodeBlock {...props} />;
});

export const CodeFullFeatured = memo((props: any) => {
  return <CodeBlock fullFeatured {...props} />;
});
