'use client';

import { createStyles } from 'antd-style';
import { FC } from 'react';

import Highlighter, { type HighlighterProps } from '@/Highlighter';
import Snippet, { type SnippetProps } from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css }) => ({
  container: css`
    overflow: hidden;
    margin-block: 1em;
    border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
    box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
  `,
  highlight: css`
    pre {
      overflow-x: hidden !important;
      padding: 1em !important;
    }
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
  icon,
  ...rest
}) => {
  const { styles, cx } = useStyles();

  return (
    <Highlighter
      allowChangeLanguage={allowChangeLanguage}
      className={cx(styles.container, styles.highlight, className)}
      copyButtonSize={{ blockSize: 28, fontSize: 16 }}
      fileName={fileName}
      fullFeatured={fullFeatured}
      icon={icon}
      language={language}
      style={style}
      type="block"
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
  ...rest
}) => {
  const { cx, styles } = useStyles();

  return (
    <Snippet
      className={cx(styles.container, className)}
      data-code-type="highlighter"
      language={language}
      style={style}
      type={'block'}
      {...rest}
    >
      {children}
    </Snippet>
  );
};

export default Pre;
