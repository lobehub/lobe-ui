import type { Root } from 'hast';
import { urlAttributes } from 'html-url-attributes';
import { defaultUrlTransform, type Options } from 'react-markdown';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { type PluggableList, unified } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

/**
 * Upper bound of cached hast trees, evicted least-recently-used first like the
 * `contentCache` in `hooks/useMarkdown/utils.ts`. It is larger than that cache
 * (50) because one entry is one message: switching back and forth between two
 * or three ~30-message conversations should still hit, while the bound keeps
 * memory flat in long sessions.
 */
const PARSE_CACHE_SIZE = 100;

/**
 * Module-level LRU of parsed hast trees, keyed by `<plugin key>\u0000<content>`.
 *
 * Why hast and not React elements: the hast tree only depends on the content
 * and the remark/rehype pipeline, while the React elements also bake in the
 * `components` map of the rendering instance (custom renderers, citations,
 * `componentProps`, ...). Caching hast lets every mount reuse the expensive
 * remark → rehype work and still run the cheap hast → JSX step with its own
 * `components`, so component overrides are never served stale.
 */
const parseCache = new Map<string, Root>();

/**
 * `react-markdown` options that change how the hast tree is post-processed
 * before it becomes JSX. They are rarely used and may carry per-instance
 * callbacks, so the cache is bypassed whenever any of them is set and the
 * stock `react-markdown` path renders instead.
 */
const POST_PROCESS_OPTIONS = [
  'allowElement',
  'allowedElements',
  'disallowedElements',
  'skipHtml',
  'unwrapDisallowed',
  'urlTransform',
] as const satisfies readonly (keyof Options)[];

export const canUseParseCache = (options: Options): boolean =>
  POST_PROCESS_OPTIONS.every((key) => options[key] === undefined);

let nextIdentityId = 0;
const identityIds = new WeakMap<object, number>();

const getIdentityId = (value: object): number => {
  let id = identityIds.get(value);
  if (id === undefined) {
    id = ++nextIdentityId;
    identityIds.set(value, id);
  }
  return id;
};

const isPlainObject = (value: object): boolean => {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Serializes a plugin list (or plugin options) into a string that is stable
 * across component instances:
 * - functions (plugins, presets, callbacks inside options) and non-plain
 *   objects are keyed by identity, so two different plugins never collide;
 * - arrays and plain objects are serialized structurally, so the
 *   `[remarkGfm, { singleTilde: false }]` tuples rebuilt by each instance's
 *   `useMemo` still map to the same key.
 *
 * The keys deliberately avoid the plugin array references themselves: every
 * `Markdown` instance memoizes its own arrays, so keying on them would miss on
 * every remount. Because the effective plugin list is derived from
 * `enableLatex`, `enableCustomFootnotes`, `enableGithubAlert`, `allowHtml`,
 * `variant` and the user-supplied plugins, serializing that list covers all
 * of those settings without enumerating them here.
 *
 * Assumption: a plugin with the same identity and options is a pure function
 * of its input. A plugin that reads external mutable state must be recreated
 * (new function identity) when that state changes, which is also what
 * `react-markdown` needs to re-render it.
 */
const serialize = (value: unknown): string => {
  if (value === null || value === undefined) return String(value);
  switch (typeof value) {
    case 'function': {
      return `f${getIdentityId(value)}`;
    }
    case 'object': {
      if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`;
      if (!isPlainObject(value)) return `o${getIdentityId(value)}`;
      const entries = Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${serialize((value as any)[key])}`);
      return `{${entries.join(',')}}`;
    }
    case 'string': {
      return JSON.stringify(value);
    }
    default: {
      return `${typeof value}:${String(value)}`;
    }
  }
};

export interface ParsePipeline {
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Options['remarkRehypeOptions'];
}

/** Stable key of the remark → rehype pipeline; part of the parse cache key. */
export const getPipelineKey = ({
  rehypePlugins,
  remarkPlugins,
  remarkRehypeOptions,
}: ParsePipeline): string =>
  `${serialize(remarkPlugins ?? [])}|${serialize(rehypePlugins ?? [])}|${serialize(remarkRehypeOptions ?? null)}`;

/**
 * Mirrors the default (no post-process options) `post` transform of
 * react-markdown 10: raw HTML nodes left by the pipeline become text, and URL
 * attributes go through `defaultUrlTransform`. Both steps are idempotent, so
 * the transformed tree can be cached and rendered any number of times.
 *
 * @see https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
 */
const applyDefaultPostTransform = (tree: Root) => {
  visit(tree, (node, index, parent) => {
    if (node.type === 'raw' && parent && typeof index === 'number') {
      parent.children[index] = { type: 'text', value: node.value };
      return index;
    }

    if (node.type === 'element') {
      for (const key in urlAttributes) {
        if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node.properties, key)) {
          const test = urlAttributes[key];
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = defaultUrlTransform(String(node.properties[key] || ''));
          }
        }
      }
    }
  });
};

/** Same pipeline as react-markdown's `createProcessor`. */
const parseMarkdown = (content: string, pipeline: ParsePipeline): Root => {
  const processor = unified()
    .use(remarkParse)
    .use(pipeline.remarkPlugins ?? [])
    .use(remarkRehype, { ...pipeline.remarkRehypeOptions, allowDangerousHtml: true })
    .use(pipeline.rehypePlugins ?? []);

  const file = new VFile();
  file.value = content;

  const tree = processor.runSync(processor.parse(file), file) as Root;
  applyDefaultPostTransform(tree);
  return tree;
};

/**
 * Returns the parsed, post-transformed hast tree for `content`, reusing a
 * cached tree when the same content was parsed with an equivalent pipeline.
 *
 * The returned tree is shared between mounts and must be treated as
 * read-only by the caller and by markdown components receiving `node`.
 */
export const getParsedHast = (content: string, pipeline: ParsePipeline, pipelineKey: string) => {
  const key = `${pipelineKey}\u0000${content}`;

  const cached = parseCache.get(key);
  if (cached) {
    // Refresh recency so frequently revisited messages stay cached.
    parseCache.delete(key);
    parseCache.set(key, cached);
    return cached;
  }

  const tree = parseMarkdown(content, pipeline);

  if (parseCache.size >= PARSE_CACHE_SIZE) {
    const oldestKey = parseCache.keys().next().value;
    if (oldestKey !== undefined) parseCache.delete(oldestKey);
  }
  parseCache.set(key, tree);

  return tree;
};

/** Test helper: drops every cached tree. */
export const clearParseCache = () => parseCache.clear();
