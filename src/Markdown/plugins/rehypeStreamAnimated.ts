import { type Element, type ElementContent, type Root } from 'hast';
import { type BuildVisitor } from 'unist-util-visit';
import { visit } from 'unist-util-visit';

import { getNow } from '@/utils/getNow';

export interface StreamAnimatedRuntime {
  births: number[];
  /**
   * Write-once per-char render cache, indexed like `births`:
   * `undefined` = char not rendered yet, `null` = born fully revealed,
   * string = inline style frozen at first render.
   * Freezing the style keeps span props referentially stable across the
   * tail block's re-renders, so React never rewrites `animation-delay`
   * on an in-flight fade (a rewrite restarts the CSS animation).
   */
  styles: (string | null | undefined)[];
}

export interface StreamAnimatedOptions {
  births?: number[];
  fadeDuration?: number;
  /**
   * `'word'` wraps whitespace-delimited runs in one span instead of one
   * span per char. Every concurrent CSS animation keeps the compositor
   * producing frames and fires animationstart/end through React's root
   * event delegation, so animating ~5x fewer nodes is the main CPU lever —
   * char-level remains available for the finer-grained look.
   */
  granularity?: 'char' | 'word';
  nowMs?: number;
  revealed?: boolean;
  runtime?: StreamAnimatedRuntime;
}

// Intl.Segmenter splits CJK runs into words too — the whitespace regex
// fallback would otherwise fade an entire unspaced CJK paragraph as one
// unit.
const WORD_SEGMENT_RE = /\s+|\S+/g;

const wordSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'word' })
    : null;

const segmentWords = (value: string): string[] => {
  if (!wordSegmenter) return value.match(WORD_SEGMENT_RE) ?? [];

  const segments: string[] = [];
  for (const item of wordSegmenter.segment(value)) {
    segments.push(item.segment);
  }
  return segments;
};

const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']);
const SKIP_TAGS = new Set(['pre', 'code', 'table', 'svg']);

function hasClass(node: Element, cls: string): boolean {
  const cn = node.properties?.className;
  if (Array.isArray(cn)) return cn.some((c) => String(c).includes(cls));
  return false;
}

export const rehypeStreamAnimated = (options: StreamAnimatedOptions = {}) => {
  const {
    births,
    fadeDuration = 150,
    granularity = 'char',
    nowMs,
    revealed = false,
    runtime,
  } = options;
  // Legacy births/nowMs callers share the runtime path through a throwaway
  // cache: the plugin factory runs once per render, so their styles are
  // recomputed against the caller's nowMs each run, exactly as before.
  const resolvedRuntime = revealed
    ? undefined
    : (runtime ??
      (Array.isArray(births) && typeof nowMs === 'number' ? { births, styles: [] } : undefined));
  const nowOverride = runtime ? undefined : nowMs;

  return (tree: Root) => {
    let globalCharIndex = 0;
    const now = nowOverride ?? (resolvedRuntime ? getNow() : 0);

    const shouldSkip = (node: Element): boolean => {
      return SKIP_TAGS.has(node.tagName) || hasClass(node, 'katex');
    };

    const resolveStyle = (index: number): string | null => {
      const styles = resolvedRuntime!.styles;
      const cached = styles[index];
      if (cached !== undefined) return cached;

      const birthTs = resolvedRuntime!.births[index];
      let resolved: string | null;
      if (birthTs === undefined) {
        resolved = null;
      } else {
        const elapsed = now - birthTs;
        // Negative delay = already elapsed ms into the fade. Positive
        // delay = not started yet (char born in the future, i.e.
        // staggered within the same commit).
        resolved = elapsed >= fadeDuration ? null : `animation-delay:${-elapsed}ms`;
      }
      styles[index] = resolved;
      return resolved;
    };

    const buildSpan = (value: string, startIndex: number): ElementContent => {
      let className = 'stream-char';
      let style: string | undefined;

      if (revealed) {
        className = 'stream-char stream-char-revealed';
      } else if (resolvedRuntime) {
        const resolved = resolveStyle(startIndex);
        if (resolved === null) {
          className = 'stream-char stream-char-revealed';
        } else {
          style = resolved;
        }
      }

      const properties: Record<string, any> = { className };
      if (style !== undefined) {
        properties.style = style;
      }
      return {
        children: [{ type: 'text', value }],
        properties,
        tagName: 'span',
        type: 'element',
      };
    };

    const wrapText = (node: Element) => {
      const newChildren: ElementContent[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          if (granularity === 'word') {
            for (const segment of segmentWords(child.value)) {
              const startIndex = globalCharIndex;
              for (const _char of segment) globalCharIndex++;

              if (segment.trim() === '') {
                newChildren.push({ type: 'text', value: segment });
              } else {
                newChildren.push(buildSpan(segment, startIndex));
              }
            }
          } else {
            for (const char of child.value) {
              newChildren.push(buildSpan(char, globalCharIndex));
              globalCharIndex++;
            }
          }
        } else if (child.type === 'element') {
          if (!shouldSkip(child)) {
            wrapText(child);
          }
          newChildren.push(child);
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    };

    visit(tree, 'element', ((node: Element) => {
      if (shouldSkip(node)) return 'skip';
      if (BLOCK_TAGS.has(node.tagName)) {
        wrapText(node);
        return 'skip';
      }
    }) as BuildVisitor<Root, 'element'>);
  };
};
