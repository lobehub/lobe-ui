'use client';

import { Streamdown } from '@lobehub/streamdown';
import { memo } from 'react';
import { type Options } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';
import { useMarkdownContext } from '@/Markdown/components/MarkdownProvider';

export const StreamdownRender = memo<Options>(({ children, ...rest }) => {
  const {
    enableLatex = true,
    streamAnimationGranularity = 'char',
    streamSmoothingPreset = 'balanced',
  } = useMarkdownContext();
  const escapedContent = useMarkdownContent(children || '');
  const components = useMarkdownComponents();
  const rehypePlugins = useMarkdownRehypePlugins();
  const remarkPlugins = useMarkdownRemarkPlugins();

  return (
    <Streamdown
      {...rest}
      components={components}
      content={typeof escapedContent === 'string' ? escapedContent : ''}
      granularity={streamAnimationGranularity}
      latexGuard={enableLatex}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      smoothing={streamSmoothingPreset}
    />
  );
});

StreamdownRender.displayName = 'StreamdownRender';

export default StreamdownRender;
