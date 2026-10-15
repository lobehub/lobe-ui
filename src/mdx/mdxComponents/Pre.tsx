'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import Highlighter, { type HighlighterProps } from '@/Highlighter';
import { FALLBACK_LANG } from '@/Highlighter/const';
import HtmlPreview, { type HtmlPreviewProps } from '@/HtmlPreview';
import Mermaid, { type MermaidProps } from '@/Mermaid';
import Snippet, { type SnippetProps } from '@/Snippet';

export type PreProps = HighlighterProps;

export const Pre: FC<PreProps> = ({
  fullFeatured,
  fileName,
  allowChangeLanguage,
  language = FALLBACK_LANG,
  children,
  className,
  style,
  variant = 'filled',
  icon,
  theme,
  ...rest
}) => {
  return (
    <Highlighter
      allowChangeLanguage={allowChangeLanguage}
      className={clsx('lobe-mdx-pre', className)}
      fileName={fileName}
      fullFeatured={fullFeatured}
      icon={icon}
      language={language}
      style={style}
      theme={theme}
      variant={variant}
      {...rest}
    >
      {children}
    </Highlighter>
  );
};

export const PreSingleLine: FC<SnippetProps> = ({
  language = FALLBACK_LANG,
  children,
  className,
  style,
  variant = 'filled',
  ...rest
}) => {
  return (
    <Snippet
      className={clsx('lobe-mdx-pre', className)}
      data-code-type="highlighter"
      language={language}
      style={style}
      variant={variant}
      {...rest}
    >
      {children}
    </Snippet>
  );
};

export const PreMermaid: FC<MermaidProps> = ({
  animated,
  fullFeatured,
  children,
  className,
  style,
  variant = 'filled',
  theme,
  ...rest
}) => {
  return (
    <Mermaid
      animated={animated}
      className={clsx('lobe-mdx-pre', className)}
      fullFeatured={fullFeatured}
      style={style}
      theme={theme}
      variant={variant}
      {...rest}
    >
      {children}
    </Mermaid>
  );
};

export const PreHtmlPreview: FC<HtmlPreviewProps> = ({
  animated,
  fullFeatured,
  children,
  className,
  style,
  variant = 'filled',
  theme,
  ...rest
}) => {
  return (
    <HtmlPreview
      animated={animated}
      className={clsx('lobe-mdx-pre', className)}
      fullFeatured={fullFeatured}
      style={style}
      theme={theme}
      variant={variant}
      {...rest}
    >
      {children}
    </HtmlPreview>
  );
};

Pre.displayName = 'MdxPre';

export default Pre;
