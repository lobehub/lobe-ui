'use client';

import { useMemo } from 'react';
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

  const memoA = useMemo(() => {
    return (props: any) => <Link citations={citations} {...props} {...componentProps?.a} />;
  }, [citations, componentProps?.a]);

  const memoImg = useMemo(() => {
    return (props: any) => <Image {...props} {...componentProps?.img} />;
  }, [componentProps?.img]);

  const memoVideo = useMemo(() => {
    return (props: any) => <Video {...props} {...componentProps?.video} />;
  }, [componentProps?.video]);

  const memoSection = useMemo(() => {
    return (props: any) => <Section showFootnotes={showFootnotes} {...props} />;
  }, [showFootnotes]);

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

  const memoPre = useMemo(() => {
    return (props: any) => (
      <CodeBlock
        animated={animated}
        enableMermaid={enableMermaid}
        fullFeatured={fullFeaturedCodeBlock}
        {...stableComponentProps}
        {...componentProps?.pre}
        {...props}
      />
    );
  }, [animated, enableMermaid, fullFeaturedCodeBlock, stableComponentProps, componentProps?.pre]);

  const memoComponents = useMemo(
    () => ({
      a: memoA,
      img: memoImg,
      pre: memoPre,
      section: memoSection,
      video: memoVideo,
    }),
    [memoA, memoImg, memoVideo, memoPre, memoSection],
  );

  return useMemo(
    () => ({
      ...memoComponents,
      ...components,
    }),
    [memoComponents, components],
  );
};
