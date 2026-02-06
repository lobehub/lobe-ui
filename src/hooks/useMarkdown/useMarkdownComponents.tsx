'use client';

import { useCallback, useMemo } from 'react';
import type { Components } from 'react-markdown';

import Hotkey from '@/Hotkey';
import { CodeBlock } from '@/Markdown/components/CodeBlock';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import Image from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import Section from '@/mdx/mdxComponents/Section';
import Video from '@/mdx/mdxComponents/Video';

export const useMarkdownComponents = (): Components => {
  const {
    components,
    animated,
    citations,
    componentProps,
    enableMermaid,
    fullFeaturedCodeBlock,
    showFootnotes,
  } = useMarkdownContext();

  const memoA = useCallback(
    ({ node, ...props }: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
    [citations, componentProps?.a],
  );

  const memoImg = useCallback(
    ({ node, ...props }: any) => <Image {...props} {...componentProps?.img} />,
    [componentProps?.img],
  );

  const memoVideo = useCallback(
    ({ node, ...props }: any) => <Video {...props} {...componentProps?.video} />,
    [componentProps?.video],
  );

  const memoSection = useCallback(
    ({ node, ...props }: any) => <Section showFootnotes={showFootnotes} {...props} />,
    [showFootnotes],
  );

  const memoKbd = useCallback(
    ({ children }: any) => <Hotkey keys={children} style={{ display: 'inline-flex' }} />,
    [],
  );

  const memoBr = useCallback(() => <br />, []);

  const memeP = useCallback(({ style, children, className }: any) => {
    const skipWrapperTags = ['img', 'video'];
    if (typeof children === 'object' && skipWrapperTags.includes(children?.props?.node?.tagName)) {
      return children;
    }
    return (
      <p className={className} style={style}>
        {children}
      </p>
    );
  }, []);

  // Stable references for theme objects to prevent unnecessary re-renders
  const highlightTheme = useMemo(
    () => componentProps?.highlight?.theme,
    [JSON.stringify(componentProps?.highlight?.theme)],
  );

  const mermaidTheme = useMemo(
    () => componentProps?.mermaid?.theme,
    [JSON.stringify(componentProps?.mermaid?.theme)],
  );

  // Create stable component props reference
  const stableComponentProps = useMemo(() => {
    if (!componentProps) return;

    return {
      highlight: componentProps.highlight
        ? { ...componentProps.highlight, theme: highlightTheme }
        : undefined,
      mermaid: componentProps.mermaid
        ? { ...componentProps.mermaid, theme: mermaidTheme }
        : undefined,
    };
  }, [highlightTheme, mermaidTheme]);

  const memoPre = useCallback(
    ({ node, ...props }: any) => (
      <CodeBlock
        animated={animated}
        enableMermaid={enableMermaid}
        fullFeatured={fullFeaturedCodeBlock}
        {...stableComponentProps}
        {...componentProps?.pre}
        {...props}
      />
    ),
    [animated, enableMermaid, fullFeaturedCodeBlock, stableComponentProps, componentProps?.pre],
  );

  const memoColorPreview = useCallback(({ node, ...props }: any) => <code {...props} />, []);

  const memoComponents = useMemo(
    () => ({
      a: memoA,
      br: memoBr,
      colorPreview: memoColorPreview,
      img: memoImg,
      kbd: memoKbd,
      p: memeP,
      pre: memoPre,
      section: memoSection,
      video: memoVideo,
    }),
    [memoA, memoBr, memoImg, memoVideo, memoPre, memoSection, memeP, memoColorPreview, memoKbd],
  );

  return useMemo(
    () => ({
      ...memoComponents,
      ...components,
    }),
    [memoComponents, components],
  );
};
