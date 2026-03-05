import { type Element, type ElementContent, type Root } from 'hast';
import { type BuildVisitor } from 'unist-util-visit';
import { visit } from 'unist-util-visit';

export interface StreamAnimatedOptions {
  baseCharCount?: number;
  charDelay?: number;
  fadeDuration?: number;
  revealed?: boolean;
  timelineElapsedMs?: number;
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
  const {
    charDelay = 20,
    fadeDuration = 150,
    baseCharCount = 0,
    revealed = false,
    timelineElapsedMs,
  } = options;
  const hasTimeline = typeof timelineElapsedMs === 'number' && Number.isFinite(timelineElapsedMs);

  return (tree: Root) => {
    let globalCharIndex = 0;

    const shouldSkip = (node: Element): boolean => {
      return SKIP_TAGS.has(node.tagName) || hasClass(node, 'katex');
    };

    const wrapText = (node: Element) => {
      const newChildren: ElementContent[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          for (const char of child.value) {
            const relativeIndex = globalCharIndex - baseCharCount;
            let className = 'stream-char';
            let delay: number | undefined;

            if (revealed) {
              className = 'stream-char stream-char-revealed';
            } else if (hasTimeline) {
              const progress = (timelineElapsedMs as number) - globalCharIndex * charDelay;
              if (progress >= fadeDuration) {
                className = 'stream-char stream-char-revealed';
              } else {
                // Positive delay means "not started yet", negative keeps
                // the current in-flight progress on rerender.
                delay = -progress;
              }
            } else if (relativeIndex >= 0) {
              // Newly appended chars start with staggered positive delay.
              delay = relativeIndex * charDelay;
            } else {
              // Previously started chars continue fading with negative delay
              // instead of being immediately switched to revealed.
              const elapsed = -relativeIndex * charDelay;
              if (elapsed >= fadeDuration) {
                className = 'stream-char stream-char-revealed';
              } else {
                delay = -elapsed;
              }
            }

            const properties: Record<string, any> = { className };
            if (delay !== undefined && delay !== 0) {
              properties.style = `animation-delay:${delay}ms`;
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
