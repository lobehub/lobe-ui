'use client';

import { cx } from 'antd-style';
import { memo, useCallback } from 'react';

import { useStableValue } from '@/hooks/useStableValue';
import { PreviewGroup } from '@/Image';

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
    enableHtmlPreview = false,
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
    streamAnimationGranularity,
    streamSmoothingPreset,
    citations,
    ...rest
  } = props;

  const delayedAnimated = useDelayedAnimated(animated);

  // Stabilise structural props so an inline `componentProps={{ html:
  // {...} }}` from the caller doesn't cascade through MarkdownProvider →
  // useMarkdownComponents → react-markdown's `components` and remount the
  // entire code-block subtree (including the HtmlPreview iframe) on
  // every parent render. The deep-equal compare treats inline literals
  // as the same object as long as their structure matches. Inline
  // callbacks (`actionsRender`, custom `components`) still need
  // `useCallback` at the call site — function bodies aren't compared.
  const stableComponentProps = useStableValue(componentProps);
  const stableComponents = useStableValue(components);

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
        ref={ref}
        style={style}
        onDoubleClick={onDoubleClick}
        {...rest}
      >
        <MarkdownProvider
          allowHtml={allowHtml}
          animated={delayedAnimated}
          citations={citations}
          componentProps={stableComponentProps}
          components={stableComponents}
          enableCustomFootnotes={enableCustomFootnotes}
          enableGithubAlert={enableGithubAlert}
          enableHtmlPreview={enableHtmlPreview}
          enableLatex={enableLatex}
          enableMermaid={enableMermaid}
          fullFeaturedCodeBlock={fullFeaturedCodeBlock}
          rehypePlugins={rehypePlugins}
          rehypePluginsAhead={rehypePluginsAhead}
          remarkPlugins={remarkPlugins}
          remarkPluginsAhead={remarkPluginsAhead}
          showFootnotes={showFootnotes}
          streamAnimationGranularity={streamAnimationGranularity}
          streamSmoothingPreset={streamSmoothingPreset}
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
