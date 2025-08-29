'use client';

import { useCallback, useMemo } from 'react';
import type { Components } from 'react-markdown';

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
    showFootnotes,
    enableMermaid,
    fullFeaturedCodeBlock,
  } = useMarkdownContext();

  const memoA = useCallback(
    (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />,
    [citations, componentProps?.a],
  );

  const memoImg = useCallback(
    (props: any) => <Image {...props} {...componentProps?.img} />,
    [componentProps?.img],
  );

  const memoVideo = useCallback(
    (props: any) => <Video {...props} {...componentProps?.video} />,
    [componentProps?.video],
  );

  const memoSection = useCallback(
    (props: any) => <Section showFootnotes={showFootnotes} {...props} />,
    [showFootnotes],
  );

  const memoBr = useCallback(() => <br />, []);

  const memeP = useCallback(({ children, className }: any) => {
    const hasImage = typeof children === 'object' && children?.props?.node?.tagName === 'img';
    return hasImage ? children : <p className={className}>{children}</p>;
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
    (props: any) => (
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

  const memoComponents = useMemo(
    () => ({
      a: memoA,
      br: memoBr,
      img: memoImg,
      p: memeP,
      pre: memoPre,
      section: memoSection,
      video: memoVideo,
    }),
    [memoA, memoBr, memoImg, memoVideo, memoPre, memoSection, memeP],
  );

  return useMemo(
    () => ({
      ...memoComponents,
      ...components,
    }),
    [memoComponents, components],
  );
};
