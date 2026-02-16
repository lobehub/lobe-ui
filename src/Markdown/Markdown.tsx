'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo, useCallback, useMemo } from 'react';

import { PreviewGroup } from '@/Image';
import { resolveAnimationConfig } from '@/styles/animations';

import { MarkdownProvider } from './components/MarkdownProvider';
import { useDelayedAnimated } from './components/useDelayedAnimated';
import { variants } from './style';
import { MarkdownRender, StreamdownRender } from './SyntaxMarkdown';
import { type MarkdownProps } from './type';
import Typography from './Typography';

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
    streamAnimationWindowMs = 200,
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

  const delayedAnimated = useDelayedAnimated(animated);
  const animationResolved = useMemo(() => {
    if (enableStream && delayedAnimated) {
      return resolveAnimationConfig(true);
    }
    return resolveAnimationConfig(delayedAnimated);
  }, [delayedAnimated, enableStream]);
  const animationStyle = useMemo(
    () =>
      animationResolved
        ? ({ '--lobe-markdown-stream-animation': animationResolved.cssValue } as CSSProperties)
        : undefined,
    [animationResolved],
  );

  const Render = useCallback(
    ({
      enableStream,
      children,
      reactMarkdownProps,
      streamAnimationWindowMs,
    }: Pick<
      MarkdownProps,
      'children' | 'enableStream' | 'reactMarkdownProps' | 'streamAnimationWindowMs'
    >) => {
      const defaultDOM = enableStream ? (
        <StreamdownRender {...reactMarkdownProps} streamAnimationWindowMs={streamAnimationWindowMs}>
          {children}
        </StreamdownRender>
      ) : (
        <MarkdownRender {...reactMarkdownProps}>{children}</MarkdownRender>
      );
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
        ref={ref}
        style={{ ...style, ...animationStyle }}
        onDoubleClick={onDoubleClick}
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
            enableStream={enableStream && !!delayedAnimated}
            reactMarkdownProps={reactMarkdownProps}
            streamAnimationWindowMs={streamAnimationWindowMs}
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
