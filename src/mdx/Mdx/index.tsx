'use client';

import { evaluate } from '@mdx-js/mdx';
import { ReactNode, memo, useEffect, useMemo, useState } from 'react';
import jsxDevRuntime from 'react/jsx-dev-runtime';
import jsxRuntime from 'react/jsx-runtime';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Pluggable } from 'unified';

import Alert from '@/Alert';
import { Typography, type TypographyProps } from '@/Markdown/Typography';
import { useStyles } from '@/Markdown/style';
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from '@/Markdown/utils';

import mdxComponents from '../mdxComponents';
import CodeBlock from '../mdxComponents/CodeBlock';

const runtime = process.env.NODE_ENV === 'production' ? jsxRuntime : jsxDevRuntime;

export interface MdxProps extends Omit<TypographyProps, 'children'> {
  children: string;
  components?: any[];
  enableImageGallery?: boolean;
  enableLatex?: boolean;
  enableMermaid?: boolean;
  fallback?: ReactNode;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
  variant?: 'normal' | 'chat';
}

const Mdx = memo<MdxProps>(
  ({
    children,
    className,
    style,
    fullFeaturedCodeBlock = true,
    enableLatex = true,
    enableMermaid = true,
    rehypePlugins,
    remarkPlugins,
    components = {},
    fallback = null,
    fontSize,
    headerMultiple,
    lineHeight,
    marginMultiple,
    variant,
    ...rest
  }) => {
    const { cx, styles } = useStyles({
      fontSize,
      headerMultiple,
      lineHeight,
      marginMultiple,
    });

    const isChatMode = variant === 'chat';

    const [MDXContent, setMDXContent] = useState<any>(() => () => null);

    const escapedContent = useMemo(() => {
      if (!enableLatex) return fixMarkdownBold(children);
      return fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
    }, [children, enableLatex]);

    const innerRehypePlugins = Array.isArray(rehypePlugins) ? rehypePlugins : [rehypePlugins];
    const memoRehypePlugins = useMemo(
      () => [enableLatex && rehypeKatex, ...innerRehypePlugins].filter(Boolean) as any,
      [enableLatex, ...innerRehypePlugins],
    );

    const innerRemarkPlugins = Array.isArray(remarkPlugins) ? remarkPlugins : [remarkPlugins];
    const memoRemarkPlugins = useMemo(
      () => [remarkGfm, enableLatex && remarkMath, ...innerRemarkPlugins].filter(Boolean) as any,
      [enableLatex, ...innerRemarkPlugins],
    );

    const memoComponents = useMemo(() => {
      const list: any = {};
      Object.entries({
        ...mdxComponents,
        pre: (props: any) => (
          <CodeBlock
            {...props}
            enableMermaid={enableMermaid}
            fullFeatured={fullFeaturedCodeBlock}
          />
        ),
        ...components,
      }).forEach(([key, Render]: any) => {
        list[key] = (props: any) => <Render {...props} />;
      });
      return list;
    }, [components, enableMermaid, fullFeaturedCodeBlock]);

    useEffect(() => {
      (async () => {
        try {
          const { default: Content } = await evaluate(escapedContent, {
            ...runtime,
            development: process.env.NODE_ENV !== 'production',
            rehypePlugins: memoRehypePlugins,
            remarkPlugins: memoRemarkPlugins,
          });
          setMDXContent(() => Content);
        } catch (error: any) {
          // @ts-ignore
          setMDXContent(() => () => (
            <Alert
              description={String(error?.message as string)}
              message={'Error compiling MDX'}
              style={{
                width: '100%',
              }}
              type="error"
            />
          ));
          console.error('Error compiling MDX:', error);
        }
      })();
    }, [escapedContent, memoRehypePlugins, memoRemarkPlugins]);

    if (!MDXContent) return fallback;

    return (
      <Typography
        className={cx(enableLatex && styles.latex, isChatMode && styles.chat, className)}
        style={style}
        {...rest}
      >
        <MDXContent components={memoComponents} />
      </Typography>
    );
  },
);

export default Mdx;
