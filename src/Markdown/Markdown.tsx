'use client';

import clsx from 'clsx';
import { memo, useCallback } from 'react';

import { useStableValue } from '@/hooks/useStableValue';
import { PreviewGroup } from '@/Image';
import { toDataAttributes } from '@/utils/bem';

import { MarkdownProvider } from './components/MarkdownProvider';
import { useDelayedAnimated } from './components/useDelayedAnimated';
import { markdownClasses } from './stable';
import { rootStyles, styles } from './style';
import { MarkdownRender, StreamdownRender } from './SyntaxMarkdown';
import { type MarkdownProps } from './type';
import { TypographyImpl } from './Typography';

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
    fontSize,
    headerMultiple,
    marginMultiple,
    variant = 'default',
    reactMarkdownProps,
    lineHeight,
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
      <TypographyImpl
        borderRadius={borderRadius}
        data-code-type="markdown"
        fontSize={fontSize}
        headerMultiple={headerMultiple}
        lineHeight={lineHeight}
        marginMultiple={marginMultiple}
        ref={ref}
        style={style}
        xstyle={rootStyles.root}
        className={clsx(
          variant === 'chat' && styles.chat,
          enableLatex && styles.latex,
          styles.gfm,
          markdownClasses(),
          className,
        )}
        onDoubleClick={onDoubleClick}
        {...toDataAttributes({ variant })}
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
      </TypographyImpl>
    </PreviewGroup>
  );
});

Markdown.displayName = 'Markdown';

export default Markdown;
