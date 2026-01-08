'use client';

import type { FC } from 'react';

import { FALLBACK_LANG } from '@/Highlighter/const';
import type { MermaidProps } from '@/Mermaid';

import { Pre, PreMermaid, PreSingleLine } from '../mdxComponents/Pre';

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

const useCode = (raw: any) => {
  if (!raw) return;

  const { children = '', className } = raw?.props || { children: '' };

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
  mermaid?: MermaidProps;
}

const CodeBlock: FC<CodeBlockProps> = ({ children, fullFeatured, enableMermaid, mermaid }) => {
  const code = useCode(children);

  if (!code) return;

  if (enableMermaid && code.lang === 'mermaid')
    return (
      <PreMermaid fullFeatured={fullFeatured} {...mermaid}>
        {code.content}
      </PreMermaid>
    );

  if (code.isSingleLine) return <PreSingleLine language={code.lang}>{code.content}</PreSingleLine>;

  return (
    <Pre allowChangeLanguage={false} fullFeatured={fullFeatured} language={code.lang}>
      {code.content}
    </Pre>
  );
};

CodeBlock.displayName = 'MdxCodeBlock';

export default CodeBlock;
