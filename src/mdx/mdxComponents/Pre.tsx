'use client';

import { createStaticStyles, cx } from 'antd-style';
import type { FC } from 'react';

import Highlighter, { type HighlighterProps } from '@/Highlighter';
import { FALLBACK_LANG } from '@/Highlighter/const';
import Mermaid, { type MermaidProps } from '@/Mermaid';
import Snippet, { type SnippetProps } from '@/Snippet';

const styles = createStaticStyles(({ css }) => ({
  container: css`
    overflow: hidden;
    margin-block: calc(var(--lobe-markdown-margin-multiple) * 0.5em);
    border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
    box-shadow: 0 0 0 1px var(--lobe-markdown-border-color) inset;
  `,
}));

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
      className={cx(styles.container, className)}
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
      className={cx(styles.container, className)}
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
      className={cx(styles.container, className)}
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

Pre.displayName = 'MdxPre';

export default Pre;
