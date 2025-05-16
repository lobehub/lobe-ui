'use client';

import { cva } from 'class-variance-authority';
import { memo, useEffect, useMemo, useState } from 'react';

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
    enableImageGallery,
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
    // Add state to track delayed animated value
    const [delayedAnimated, setDelayedAnimated] = useState(animated);

    // Watch for changes in animated prop
    useEffect(() => {
      // If animated changes from true to false, delay the update by 1 second
      if (animated === false && delayedAnimated === true) {
        const timer = setTimeout(() => {
          setDelayedAnimated(false);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        // For any other changes, update immediately
        setDelayedAnimated(animated);
      }
    }, [animated, delayedAnimated]);

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
        className={cx(variants({ animated: delayedAnimated, enableLatex, variant }), className)}
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
          animated={delayedAnimated}
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
