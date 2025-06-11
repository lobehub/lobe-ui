'use client';

import { evaluate } from '@mdx-js/mdx';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import jsxDevRuntime from 'react/jsx-dev-runtime';
import jsxRuntime from 'react/jsx-runtime';
import type { Pluggable } from 'unified';

import Alert from '@/Alert';
import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

import mdxComponents from '../../mdxComponents';
import CodeBlock from '../../mdxComponents/CodeBlock';
import Image from '../../mdxComponents/Image';
import Video from '../../mdxComponents/Video';

const runtime = process.env.NODE_ENV === 'production' ? jsxRuntime : jsxDevRuntime;

export interface SyntaxMdxProps {
  children: string;
  enableMermaid?: boolean;
  fullFeatured?: boolean;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
}

const MdxRenderer = memo<{
  content: string;
  enableMermaid?: boolean;
  fullFeatured?: boolean;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
}>(({ content, enableMermaid = true, fullFeatured = true, rehypePlugins, remarkPlugins }) => {
  const [MDXContent, setMDXContent] = useState<any>(() => () => null);
  const components = useMarkdownComponents();
  const defaultRehypePlugins = useMarkdownRehypePlugins();
  const defaultRemarkPlugins = useMarkdownRemarkPlugins();

  const finalRehypePlugins = useMemo(
    () => [...defaultRehypePlugins, ...(rehypePlugins || [])],
    [defaultRehypePlugins, rehypePlugins],
  );

  const finalRemarkPlugins = useMemo(
    () => [...defaultRemarkPlugins, ...(remarkPlugins || [])],
    [defaultRemarkPlugins, remarkPlugins],
  );

  // 创建稳定的 CodeBlock 组件引用
  const MemoCodeBlock = useCallback(
    (props: any) => (
      <CodeBlock {...props} enableMermaid={enableMermaid} fullFeatured={fullFeatured} />
    ),
    [enableMermaid, fullFeatured],
  );

  // 创建稳定的组件映射
  const memoComponents = useMemo(() => {
    return {
      ...mdxComponents,
      ...components,
      img: Image,
      pre: MemoCodeBlock,
      video: Video,
    };
  }, [components, MemoCodeBlock]);

  useEffect(() => {
    (async () => {
      try {
        const { default: Content } = await evaluate(content, {
          ...runtime,
          development: process.env.NODE_ENV !== 'production',
          rehypePlugins: finalRehypePlugins,
          remarkPlugins: finalRemarkPlugins,
        });
        setMDXContent(() => Content);
      } catch (error: any) {
        setMDXContent(() => () => (
          <Alert
            description={String(error?.message as string)}
            message={'Error compiling MDX'}
            style={{ width: '100%' }}
            type="error"
          />
        ));
        console.error('Error compiling MDX:', error);
      }
    })();
  }, [content, finalRehypePlugins, finalRemarkPlugins]);

  if (!MDXContent) return null;

  return <MDXContent components={memoComponents} />;
});

MdxRenderer.displayName = 'MdxRenderer';

const SyntaxMdx = memo<SyntaxMdxProps>(
  ({ children, enableMermaid, fullFeatured, rehypePlugins, remarkPlugins }) => {
    const escapedContent = useMarkdownContent(children || '');
    return (
      <MdxRenderer
        content={escapedContent || ''}
        enableMermaid={enableMermaid}
        fullFeatured={fullFeatured}
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins}
      />
    );
  },
);

SyntaxMdx.displayName = 'SyntaxMdx';

export default SyntaxMdx;
