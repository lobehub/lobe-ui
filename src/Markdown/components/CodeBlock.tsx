import { memo } from 'react';

import type { HighlighterProps } from '@/Highlighter';
import { FALLBACK_LANG } from '@/Highlighter/const';
import { isFullHtmlDocument } from '@/HtmlPreview/const';
import type { HtmlPreviewProps } from '@/HtmlPreview/type';
import Pre, { PreHtmlPreview, PreMermaid, PreSingleLine } from '@/mdx/mdxComponents/Pre';
import type { MermaidProps } from '@/Mermaid';

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

export const useCode = (raw: any) => {
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
  animated?: boolean;
  children: any;
  enableHtmlPreview?: boolean;
  enableMermaid?: boolean;
  fullFeatured?: boolean;
  highlight?: HighlighterProps;
  html?: HtmlPreviewProps;
  mermaid?: MermaidProps;
}

export const CodeBlock = memo<CodeBlockProps>(
  ({
    fullFeatured,
    enableHtmlPreview,
    enableMermaid,
    highlight,
    html,
    mermaid,
    children,
    animated,
    ...rest
  }) => {
    const code = useCode(children);

    if (!code) return;

    if (enableMermaid && code.lang === 'mermaid')
      return (
        <PreMermaid animated={animated} fullFeatured={fullFeatured} {...mermaid} {...rest}>
          {code.content}
        </PreMermaid>
      );

    // Auto-route to HTML preview only for full HTML documents. Fragments fall
    // through to the normal highlighter — inline-rendering a `<div>` snippet
    // produces a degraded experience and risks hiding the actual code from
    // the reader.
    if (enableHtmlPreview && code.lang === 'html' && isFullHtmlDocument(code.content))
      return (
        <PreHtmlPreview animated={animated} fullFeatured={fullFeatured} {...html} {...rest}>
          {code.content}
        </PreHtmlPreview>
      );

    if (!highlight && code.isSingleLine)
      return <PreSingleLine language={code.lang}>{code.content}</PreSingleLine>;

    return (
      <Pre
        animated={animated}
        fullFeatured={fullFeatured}
        language={code.lang}
        {...highlight}
        {...rest}
      >
        {code.content}
      </Pre>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
