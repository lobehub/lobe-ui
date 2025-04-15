'use client';

import { createStyles } from 'antd-style';
import type { FC } from 'react';

import Highlighter, { type HighlighterProps } from '@/Highlighter';
import Mermaid, { type MermaidProps } from '@/Mermaid';
import Snippet, { type SnippetProps } from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css }) => ({
  container: css`
    overflow: hidden;
    margin-block: 1em;
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
  ...rest
}) => {
  const { styles, cx } = useStyles();

  return (
    <Highlighter
      allowChangeLanguage={allowChangeLanguage}
      className={cx(styles.container, className)}
      fileName={fileName}
      fullFeatured={fullFeatured}
      icon={icon}
      language={language}
      style={style}
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
  variant = 'outlined',
  ...rest
}) => {
  const { cx, styles } = useStyles();

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
  fullFeatured,
  children,
  className,
  style,
  variant = 'outlined',
  ...rest
}) => {
  const { styles, cx } = useStyles();

  return (
    <Mermaid
      className={cx(styles.container, className)}
      fullFeatured={fullFeatured}
      style={style}
      variant={variant}
      {...rest}
    >
      {children}
    </Mermaid>
  );
};

Pre.displayName = 'MdxPre';

export default Pre;
