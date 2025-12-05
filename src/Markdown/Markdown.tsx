'use client';

import { cva } from 'class-variance-authority';
import { memo, useCallback, useMemo } from 'react';

import { PreviewGroup } from '@/Image';

import { MarkdownRender, StreamdownRender } from './SyntaxMarkdown';
import Typography from './Typography';
import { MarkdownProvider } from './components/MarkdownProvider';
import { useDelayedAnimated } from './components/useDelayedAnimated';
import { useStyles } from './style';
import type { MarkdownProps } from './type';

const Markdown = memo<MarkdownProps>((props) => {
  const {
    ref,
    children = '',
    className,
    style,
    fullFeaturedCodeBlock,
    onDoubleClick,
    animated,
    enableLatex = true,
    enableMermaid = true,
    enableImageGallery,
    enableCustomFootnotes,
    enableGithubAlert,
    enableStream = true,
    componentProps,
    rehypePluginsAhead,
    allowHtml,
    borderRadius,
    fontSize = props.variant === 'chat' ? 14 : undefined,
    headerMultiple = props.variant === 'chat' ? 0.25 : undefined,
    marginMultiple = props.variant === 'chat' ? 1 : undefined,
    variant = 'default',
    reactMarkdownProps,
    lineHeight = props.variant === 'chat' ? 1.6 : undefined,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    showFootnotes = true,
    citations,
    ...rest
  } = props;

  const { cx, styles } = useStyles();

  const delayedAnimated = useDelayedAnimated(animated);

  // Style variant handling
  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          enableGfm: true,
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
          enableGfm: {
            true: styles.gfm,
            false: null,
          },
        },
        /* eslint-enable sort-keys-fix/sort-keys-fix */
      }),
    [styles],
  );

  const Render = useCallback(
    ({
      enableStream,
      children,
      reactMarkdownProps,
    }: Pick<MarkdownProps, 'children' | 'enableStream' | 'reactMarkdownProps'>) => {
      const DefaultRender = enableStream ? StreamdownRender : MarkdownRender;
      const defaultDOM = <DefaultRender {...reactMarkdownProps}>{children}</DefaultRender>;
      return customRender ? customRender(defaultDOM, { text: children }) : defaultDOM;
    },
    [customRender],
  );

  return (
    <PreviewGroup enable={enableImageGallery}>
      <Typography
        borderRadius={borderRadius}
        className={cx(variants({ enableLatex, variant }), className)}
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
        <MarkdownProvider
          allowHtml={allowHtml}
          animated={delayedAnimated}
          citations={citations}
          componentProps={componentProps}
          components={components}
          enableCustomFootnotes={enableCustomFootnotes}
          enableGithubAlert={enableGithubAlert}
          enableLatex={enableLatex}
          enableMermaid={enableMermaid}
          fullFeaturedCodeBlock={fullFeaturedCodeBlock}
          rehypePlugins={rehypePlugins}
          rehypePluginsAhead={rehypePluginsAhead}
          remarkPlugins={remarkPlugins}
          remarkPluginsAhead={remarkPluginsAhead}
          showFootnotes={showFootnotes}
          variant={variant}
        >
          <Render
            enableStream={enableStream && delayedAnimated}
            reactMarkdownProps={reactMarkdownProps}
          >
            {children}
          </Render>
        </MarkdownProvider>
      </Typography>
    </PreviewGroup>
  );
});

Markdown.displayName = 'Markdown';

export default Markdown;
