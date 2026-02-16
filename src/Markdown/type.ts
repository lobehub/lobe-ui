import { type AnchorProps } from 'antd';
import { type CSSProperties, type ElementType, type FC, type ReactNode, type Ref } from 'react';
import { type Components, type Options as ReactMarkdownOptions } from 'react-markdown';
import { type Pluggable } from 'unified';

import { type HighlighterProps } from '@/Highlighter';
import { type ImageProps, type PreProps, type VideoProps } from '@/mdx';
import { type MermaidProps } from '@/Mermaid';
import { type AProps, type DivProps } from '@/types';
import { type CitationItem } from '@/types/citation';

export interface TypographyProps extends DivProps {
  borderRadius?: number;
  fontSize?: number;
  headerMultiple?: number;
  lineHeight?: number;
  marginMultiple?: number;
  ref?: Ref<HTMLDivElement>;
}

export interface SyntaxMarkdownProps {
  allowHtml?: boolean;
  allowHtmlList?: ElementType[];
  animated?: boolean;
  children: string;
  citations?: CitationItem[];
  componentProps?: {
    a?: Partial<AProps & AnchorProps>;
    highlight?: Partial<HighlighterProps>;
    img?: Partial<ImageProps>;
    mermaid?: Partial<MermaidProps>;
    pre?: Partial<PreProps>;
    video?: Partial<VideoProps>;
  };
  components?: Components & Record<string, FC>;
  enableCustomFootnotes?: boolean;
  enableGithubAlert?: boolean;
  enableLatex?: boolean;
  enableMermaid?: boolean;
  enableStream?: boolean;
  fullFeaturedCodeBlock?: boolean;
  reactMarkdownProps?: Omit<
    Readonly<ReactMarkdownOptions>,
    'components' | 'rehypePlugins' | 'remarkPlugins'
  >;
  rehypePlugins?: Pluggable[];
  rehypePluginsAhead?: Pluggable[];
  remarkPlugins?: Pluggable[];
  remarkPluginsAhead?: Pluggable[];
  showFootnotes?: boolean;
  streamAnimationDurationMs?: number;
  streamAnimationWindowMs?: number;
  variant?: 'default' | 'chat';
}

export interface MarkdownProps extends SyntaxMarkdownProps, Omit<TypographyProps, 'children'> {
  className?: string;
  customRender?: (dom: ReactNode, context: { text: string }) => ReactNode;
  enableImageGallery?: boolean;
  onDoubleClick?: () => void;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
}
