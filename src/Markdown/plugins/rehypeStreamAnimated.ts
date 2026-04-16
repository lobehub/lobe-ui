import { type Element, type ElementContent, type Root } from 'hast';
import { type BuildVisitor } from 'unist-util-visit';
import { visit } from 'unist-util-visit';

export interface StreamAnimatedOptions {
  births?: number[];
  fadeDuration?: number;
  nowMs?: number;
  revealed?: boolean;
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
  const { births, fadeDuration = 150, nowMs, revealed = false } = options;
  const hasBirths = !revealed && Array.isArray(births) && typeof nowMs === 'number';

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
            let className = 'stream-char';
            let delay: number | undefined;

            if (revealed) {
              className = 'stream-char stream-char-revealed';
            } else if (hasBirths) {
              const birthTs = births![globalCharIndex];
              if (birthTs === undefined) {
                className = 'stream-char stream-char-revealed';
              } else {
                const elapsed = (nowMs as number) - birthTs;
                if (elapsed >= fadeDuration) {
                  className = 'stream-char stream-char-revealed';
                } else {
                  // Negative delay = already elapsed ms into the fade.
                  // Positive delay = not started yet (char born in the future,
                  // i.e. staggered within the same commit).
                  delay = -elapsed;
                }
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
