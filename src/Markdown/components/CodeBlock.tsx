import { FC } from 'react';

import { type HighlighterProps } from '@/Highlighter';
import { type MermaidProps } from '@/Mermaid';
import { FALLBACK_LANG } from '@/hooks/useHighlight';
import Pre, { PreMermaid, PreSingleLine } from '@/mdx/mdxComponents/Pre';

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

export const useCode = (raw: any) => {
  if (!raw) return;

  const { children, className } = raw.props;

  if (!children) return;

  const content = Array.isArray(children) ? (children[0] as string) : children;

  const lang = className?.replace('language-', '') || FALLBACK_LANG;

  const isSingleLine = countLines(content) <= 1 && content.length <= 32;

  return {
    content,
    isSingleLine,
    lang,
  };
};

interface CodeBlockProps {
  children: any;
  enableMermaid?: boolean;
  fullFeatured?: boolean;
  highlight?: HighlighterProps;
  mermaid?: MermaidProps;
}

const CodeBlock: FC<CodeBlockProps> = ({
  fullFeatured,
  enableMermaid,
  highlight,
  mermaid,
  children,
  ...rest
}) => {
  const code = useCode(children);

  if (!code) return;

  if (enableMermaid && code.lang === 'mermaid')
    return (
      <PreMermaid fullFeatured={fullFeatured} {...mermaid} {...rest}>
        {code.content}
      </PreMermaid>
    );

  if (!highlight && code.isSingleLine)
    return <PreSingleLine language={code.lang}>{code.content}</PreSingleLine>;

  return (
    <Pre fullFeatured={fullFeatured} language={code.lang} {...highlight} {...rest}>
      {code.content}
    </Pre>
  );
};

export const CodeLite: FC<CodeBlockProps> = (props) => {
  return <CodeBlock {...props} />;
};

export const CodeFullFeatured: FC<CodeBlockProps> = (props) => {
  return <CodeBlock fullFeatured {...props} />;
};
