'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import SyntaxMarkdown from './SyntaxMarkdown';
import Typography from './Typography';
import { useStyles } from './style';
import type { MarkdownProps } from './type';

const Markdown = memo<MarkdownProps>(
  ({
    ref,
    children,
    className,
    style,
    fullFeaturedCodeBlock,
    onDoubleClick,
    animated,
    enableLatex = true,
    enableMermaid = true,
    enableImageGallery = true,
    enableCustomFootnotes,
    componentProps,
    allowHtml,
    fontSize = 14,
    headerMultiple = 0.25,
    marginMultiple = 1,
    showFootnotes,
    variant = 'default',
    reactMarkdownProps,
    lineHeight = 1.6,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    citations,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    // Style variant handling
    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            animated: false,
            enableLatex: true,
            variant: 'default',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              default: null,
              chat: styles.chat,
            },
            enableLatex: {
              true: styles.latex,
              false: null,
            },
            animated: {
              true: styles.animated,
              false: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Typography
        className={cx(variants({ animated, enableLatex, variant }), className)}
        data-code-type="markdown"
        fontSize={fontSize}
        headerMultiple={headerMultiple}
        lineHeight={lineHeight}
        marginMultiple={marginMultiple}
        onDoubleClick={onDoubleClick}
        ref={ref}
        style={style}
        {...rest}
      >
        <SyntaxMarkdown
          allowHtml={allowHtml}
          animated={animated}
          citations={citations}
          componentProps={componentProps}
          components={components}
          customRender={customRender}
          enableCustomFootnotes={enableCustomFootnotes}
          enableImageGallery={enableImageGallery}
          enableLatex={enableLatex}
          enableMermaid={enableMermaid}
          fullFeaturedCodeBlock={fullFeaturedCodeBlock}
          reactMarkdownProps={reactMarkdownProps}
          rehypePlugins={rehypePlugins}
          remarkPlugins={remarkPlugins}
          remarkPluginsAhead={remarkPluginsAhead}
          showFootnotes={showFootnotes}
          variant={variant}
        >
          {children}
        </SyntaxMarkdown>
      </Typography>
    );
  },
);

Markdown.displayName = 'Markdown';

export default Markdown;
