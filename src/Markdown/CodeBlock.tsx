import { FC } from 'react';

import { FALLBACK_LANG } from '@/hooks/useHighlight';

import Pre, { type PreProps, PreSingleLine } from '../mdx/Pre';

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

const useCode = (raw: any) => {
  if (!raw) return;

  const { children, className } = raw.props;

  if (!children) return;

  const content = (Array.isArray(children) ? (children[0] as string) : children);

  const lang = className?.replace('language-', '') || FALLBACK_LANG;

  const isSingleLine = countLines(content) <= 1 && content.length <= 32;

  return {
    content,
    isSingleLine,
    lang,
  };
};

const CodeBlock: FC<Partial<PreProps>> = ({ fullFeatured, ...rest }) => {
  const code = useCode(rest?.children?.[0]);

  if (!code) return;

  if (code.isSingleLine) return <PreSingleLine language={code.lang}>{code.content}</PreSingleLine>;

  return (
    <Pre fullFeatured={fullFeatured} language={code.lang} {...rest}>
      {code.content}
    </Pre>
  );
};

export const CodeLite: FC<Partial<PreProps>> = (props) => {
  return <CodeBlock {...props} />;
};

export const CodeFullFeatured: FC<Partial<PreProps>> = (props) => {
  return <CodeBlock fullFeatured {...props} />;
};
