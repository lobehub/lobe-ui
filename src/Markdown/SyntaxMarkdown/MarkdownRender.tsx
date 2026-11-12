'use client';

import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { memo, type NamedExoticComponent, useMemo } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import Markdown, { type Options } from 'react-markdown';

import {
  useMarkdownComponents,
  useMarkdownContent,
  useMarkdownRehypePlugins,
  useMarkdownRemarkPlugins,
} from '@/hooks/useMarkdown';

import { canUseParseCache, getParsedHast, getPipelineKey } from './parseCache';

const MarkdownRenderer: NamedExoticComponent<Options> = memo<Options>(
  ({ children, ...rest }) => {
    const escapedContent = useMarkdownContent(children || '') ?? '';
    const components = useMarkdownComponents();
    const rehypePluginsList = useMarkdownRehypePlugins();
    const remarkPluginsList = useMarkdownRemarkPlugins();

    const cacheable = canUseParseCache(rest);
    const { remarkRehypeOptions } = rest;

    const pipeline = useMemo(
      () => ({
        rehypePlugins: rehypePluginsList,
        remarkPlugins: remarkPluginsList,
        remarkRehypeOptions,
      }),
      [rehypePluginsList, remarkPluginsList, remarkRehypeOptions],
    );
    const pipelineKey = useMemo(() => getPipelineKey(pipeline), [pipeline]);

    // Remounts (e.g. switching conversations) reuse the parsed hast from the
    // module-level cache and only run hast → JSX with this instance's
    // `components`; see `parseCache.ts` for the cache key.
    const tree = useMemo(
      () => (cacheable ? getParsedHast(escapedContent, pipeline, pipelineKey) : undefined),
      [cacheable, escapedContent, pipeline, pipelineKey],
    );

    const element = useMemo(
      () =>
        tree &&
        toJsxRuntime(tree, {
          Fragment,
          components,
          ignoreInvalidStyle: true,
          jsx,
          jsxs,
          passKeys: true,
          passNode: true,
        }),
      [tree, components],
    );

    if (element) return element;

    return (
      <Markdown
        {...rest}
        components={components}
        rehypePlugins={rehypePluginsList}
        remarkPlugins={remarkPluginsList}
      >
        {escapedContent}
      </Markdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

export default MarkdownRenderer;
