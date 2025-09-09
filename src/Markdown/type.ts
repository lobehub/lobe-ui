import type { AnchorProps } from 'antd';
import { CSSProperties, ElementType, FC, ReactNode, Ref } from 'react';
import type { Options as ReactMarkdownOptions } from 'react-markdown';
import type { Components } from 'react-markdown/lib';
import type { Pluggable } from 'unified';

import type { HighlighterProps } from '@/Highlighter';
import type { MermaidProps } from '@/Mermaid';
import type { ImageProps, PreProps, VideoProps } from '@/mdx';
import type { AProps, DivProps } from '@/types';
import type { CitationItem } from '@/types/citation';

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
