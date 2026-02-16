'use client';

import { memo, useMemo } from 'react';
import type { Components } from 'react-markdown';

import Hotkey from '@/Hotkey';
import { CodeBlock } from '@/Markdown/components/CodeBlock';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';
import Image from '@/mdx/mdxComponents/Image';
import Link from '@/mdx/mdxComponents/Link';
import Section from '@/mdx/mdxComponents/Section';
import Video from '@/mdx/mdxComponents/Video';

const MdBr = () => <br />;

const MdP = memo(({ style, children, className }: any) => {
  const skipWrapperTags = ['img', 'video'];
  if (typeof children === 'object' && skipWrapperTags.includes(children?.props?.node?.tagName)) {
    return children;
  }
  return (
    <p className={className} style={style}>
      {children}
    </p>
  );
});

const MdImg = memo(({ node: _, ...props }: any) => {
  const { componentProps } = useMarkdownContext();
  return <Image {...props} {...componentProps?.img} />;
});

const MdKbd = ({ children }: any) => <Hotkey keys={children} style={{ display: 'inline-flex' }} />;

const MdColorPreview = memo(({ node: _, ...props }: any) => <code {...props} />);

const MdA = ({ node: _, ...props }: any) => {
  const { citations, componentProps } = useMarkdownContext();
  return <Link citations={citations} {...props} {...componentProps?.a} />;
};

const MdVideo = memo(({ node: _, ...props }: any) => {
  const { componentProps } = useMarkdownContext();
  return <Video {...props} {...componentProps?.video} />;
});

const MdSection = ({ node: _, ...props }: any) => {
  const { showFootnotes } = useMarkdownContext();
  return <Section showFootnotes={showFootnotes} {...props} />;
};

const MdPre = memo(({ node: _, ...props }: any) => {
  const { animated, enableMermaid, fullFeaturedCodeBlock, componentProps } = useMarkdownContext();
  return (
    <CodeBlock
      animated={animated}
      enableMermaid={enableMermaid}
      fullFeatured={fullFeaturedCodeBlock}
      highlight={componentProps?.highlight}
      mermaid={componentProps?.mermaid}
      {...componentProps?.pre}
      {...props}
    />
  );
});

export const useMarkdownComponents = (): Components => {
  const { components } = useMarkdownContext();

  return useMemo(
    () => ({
      a: MdA,
      br: MdBr,
      colorPreview: MdColorPreview,
      img: MdImg,
      kbd: MdKbd,
      p: MdP,
      pre: MdPre,
      section: MdSection,
      video: MdVideo,
      ...components,
    }),
    [components],
  );
};
