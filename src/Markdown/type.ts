import type { AnchorProps } from 'antd';
import type { CSSProperties, FC, ReactNode, Ref } from 'react';
import type { Options as ReactMarkdownOptions } from 'react-markdown';
import type { Components } from 'react-markdown/lib';
import type { Pluggable } from 'unified';

import type { HighlighterProps } from '@/Highlighter';
import type { MermaidProps } from '@/Mermaid';
import type { ImageProps, PreProps, VideoProps } from '@/mdx';
import type { AProps, DivProps } from '@/types';
import type { CitationItem } from '@/types/citation';

export interface TypographyProps extends DivProps {
  fontSize?: number;
  headerMultiple?: number;
  lineHeight?: number;
  marginMultiple?: number;
  ref?: Ref<HTMLDivElement>;
}

export interface MarkdownProps extends TypographyProps {
  allowHtml?: boolean;
  children: string;
  citations?: CitationItem[];
  className?: string;
  componentProps?: {
    a?: Partial<AProps & AnchorProps>;
    highlight?: Partial<HighlighterProps>;
    img?: Partial<ImageProps>;
    mermaid?: Partial<MermaidProps>;
    pre?: Partial<PreProps>;
    video?: Partial<VideoProps>;
  };
  components?: Components & Record<string, FC>;
  customRender?: (dom: ReactNode, context: { text: string }) => ReactNode;
  enableCustomFootnotes?: boolean;
  enableImageGallery?: boolean;
  enableLatex?: boolean;
  enableMermaid?: boolean;
  fullFeaturedCodeBlock?: boolean;
  onDoubleClick?: () => void;
  reactMarkdownProps?: Omit<
    Readonly<ReactMarkdownOptions>,
    'components' | 'rehypePlugins' | 'remarkPlugins'
  >;
  ref?: Ref<HTMLDivElement>;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
  remarkPluginsAhead?: Pluggable[];
  showFootnotes?: boolean;
  style?: CSSProperties;
  variant?: 'default' | 'chat';
}
