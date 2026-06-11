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
  nowMs?: number;
  revealed?: boolean;
  runtime?: StreamAnimatedRuntime;
}

const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']);
const SKIP_TAGS = new Set(['pre', 'code', 'table', 'svg']);

function hasClass(node: Element, cls: string): boolean {
  const cn = node.properties?.className;
  if (Array.isArray(cn)) return cn.some((c) => String(c).includes(cls));
  if (typeof cn === 'string') return cn.includes(cls);
  return false;
}

export const rehypeStreamAnimated = (options: StreamAnimatedOptions = {}) => {
  const { births, fadeDuration = 150, nowMs, revealed = false, runtime } = options;
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

    const wrapText = (node: Element) => {
      const newChildren: ElementContent[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          for (const char of child.value) {
            let className = 'stream-char';
            let style: string | undefined;

            if (revealed) {
              className = 'stream-char stream-char-revealed';
            } else if (resolvedRuntime) {
              const resolved = resolveStyle(globalCharIndex);
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
            newChildren.push({
              children: [{ type: 'text', value: char }],
              properties,
              tagName: 'span',
              type: 'element',
            });
            globalCharIndex++;
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
