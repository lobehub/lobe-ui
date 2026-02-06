'use client';

import { cx } from 'antd-style';
import { memo, useCallback } from 'react';

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

  const delayedAnimated = useDelayedAnimated(animated);

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
