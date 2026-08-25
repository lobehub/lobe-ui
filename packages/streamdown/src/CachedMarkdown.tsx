'use client';

import { type Nodes, type Root } from 'hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { urlAttributes } from 'html-url-attributes';
import { useMemo } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { defaultUrlTransform, type Options } from 'react-markdown';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { type PluggableList, unified } from 'unified';
import { type BuildVisitor, visit } from 'unist-util-visit';
import { VFile } from 'vfile';

const EMPTY_PLUGINS: PluggableList = [];
const DEFAULT_REMARK_REHYPE_OPTIONS = { allowDangerousHtml: true };

/**
 * Render-equivalent of react-markdown's synchronous `<Markdown>` that keeps
 * the unified processor across renders. react-markdown rebuilds the whole
 * plugin chain on every render; the streaming tail block re-renders on every
 * reveal commit (~20/s) with identical plugin identities, so caching the
 * processor removes the per-commit chain construction. `post`/`transform`
 * mirror react-markdown@10 — keep them in sync when upgrading it.
 */
export const CachedMarkdown = (options: Options) => {
  const { children, rehypePlugins, remarkPlugins, remarkRehypeOptions } = options;

  const processor = useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkPlugins || EMPTY_PLUGINS)
      .use(
        remarkRehype,
        remarkRehypeOptions
          ? { ...remarkRehypeOptions, ...DEFAULT_REMARK_REHYPE_OPTIONS }
          : DEFAULT_REMARK_REHYPE_OPTIONS,
      )
      .use(rehypePlugins || EMPTY_PLUGINS);
  }, [rehypePlugins, remarkPlugins, remarkRehypeOptions]);

  const file = new VFile();
  file.value = typeof children === 'string' ? children : '';

  return post(processor.runSync(processor.parse(file), file) as Nodes, options);
};

function post(tree: Nodes, options: Options) {
  const {
    allowedElements,
    allowElement,
    components,
    disallowedElements,
    skipHtml,
    unwrapDisallowed,
  } = options;
  const urlTransform = options.urlTransform || defaultUrlTransform;

  if (allowedElements && disallowedElements) {
    throw new Error(
      'Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other',
    );
  }

  const transform: BuildVisitor<Root> = (node, index, parent) => {
    const rawNode = node as unknown as { type?: string; value?: unknown };
    if (
      rawNode.type === 'raw' &&
      typeof rawNode.value === 'string' &&
      parent &&
      typeof index === 'number'
    ) {
      if (skipHtml) {
        parent.children.splice(index, 1);
      } else {
        parent.children[index] = { type: 'text', value: rawNode.value };
      }

      return index;
    }

    if (node.type === 'element') {
      let key: string;

      for (key in urlAttributes) {
        if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node.properties, key)) {
          const value = node.properties[key];
          const test = urlAttributes[key];
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform(String(value || ''), key, node);
          }
        }
      }

      let remove = allowedElements
        ? !allowedElements.includes(node.tagName)
        : disallowedElements
          ? disallowedElements.includes(node.tagName)
          : false;

      if (!remove && allowElement && typeof index === 'number') {
        remove = !allowElement(node, index, parent);
      }

      if (remove && parent && typeof index === 'number') {
        if (unwrapDisallowed && node.children) {
          parent.children.splice(index, 1, ...node.children);
        } else {
          parent.children.splice(index, 1);
        }

        return index;
      }
    }
  };

  visit(tree as Root, transform);

  return toJsxRuntime(tree, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  });
}
