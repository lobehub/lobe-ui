import { type Element, type Parent, type Root, type Text } from 'hast';

const WHITESPACE_RE = /\s/;
const WHITESPACE_ONLY_RE = /^\s+$/;
const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const SKIP_TAGS = new Set(['code', 'pre', 'svg', 'math', 'annotation']);
const ANIMATION_CLASS_NAME = 'animate-stream';
const INCOMPLETE_LINK_PROTOCOL = 'streamdown:incomplete-link';

export interface RehypeStreamAnimatedOptions {
  animateFromSourceOffset?: number;
  animateRanges?: Array<{ end: number; key: string; start: number }>;
  animationDurationMs?: number;
}

const isElement = (node: unknown): node is Element => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as Element).type === 'element'
  );
};

const isParentNode = (node: unknown): node is Parent => {
  return typeof node === 'object' && node !== null && 'children' in node;
};

const getTextContent = (node: Parent | Text): string => {
  if ('value' in node) {
    return (node as Text).value;
  }

  let result = '';
  for (const child of (node as Parent).children) {
    if (child.type === 'text') {
      result += child.value;
      continue;
    }

    if (isParentNode(child)) {
      result += getTextContent(child);
    }
  }

  return result;
};

const isIncompleteRemendLink = (node: Element): boolean => {
  if (node.tagName !== 'a') return false;

  const href = node.properties?.href;
  if (typeof href === 'string') {
    return href === INCOMPLETE_LINK_PROTOCOL;
  }

  if (Array.isArray(href)) {
    return href.includes(INCOMPLETE_LINK_PROTOCOL);
  }

  return false;
};

const splitByWord = (text: string): string[] => {
  const coarseParts: string[] = [];
  let current = '';
  let inWhitespace = false;

  for (const char of text) {
    const isWhitespace = WHITESPACE_RE.test(char);
    if (isWhitespace !== inWhitespace && current) {
      coarseParts.push(current);
      current = '';
    }

    current += char;
    inWhitespace = isWhitespace;
  }

  if (current) {
    coarseParts.push(current);
  }

  const parts: string[] = [];
  for (const part of coarseParts) {
    if (WHITESPACE_ONLY_RE.test(part) || !CJK_RE.test(part)) {
      parts.push(part);
      continue;
    }

    parts.push(...Array.from(part));
  }

  return parts;
};

const makeSpan = (word: string, spanKey?: string, animationDurationMs?: number): Element => {
  const properties: Record<string, string> = {
    className: ANIMATION_CLASS_NAME,
  };
  if (spanKey) {
    properties.key = spanKey;
  }
  if (animationDurationMs !== undefined) {
    properties.style = `animation-duration:${animationDurationMs}ms`;
  }

  return {
    children: [{ type: 'text', value: word }],
    properties,
    tagName: 'span',
    type: 'element',
  };
};

const makeText = (value: string): Text => ({
  type: 'text',
  value,
});

const splitAnimatedSegment = (
  text: string,
  spanKey?: string,
  animationDurationMs?: number,
): Array<Element | Text> => {
  if (!text) return [];
  if (WHITESPACE_ONLY_RE.test(text)) return [makeText(text)];

  const leadingMatch = text.match(/^\s+/)?.[0] ?? '';
  const trailingMatch = text.match(/\s+$/)?.[0] ?? '';
  const leadingLength = leadingMatch.length;
  const trailingLength = trailingMatch.length;
  const core = text.slice(leadingLength, text.length - trailingLength);
  const nodes: Array<Element | Text> = [];

  if (leadingMatch) nodes.push(makeText(leadingMatch));
  if (core) nodes.push(makeSpan(core, spanKey, animationDurationMs));
  if (trailingMatch) nodes.push(makeText(trailingMatch));

  return nodes;
};

const getSourceOffsets = (node: Text): { end?: number; start?: number } => {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;

  return {
    end: typeof end === 'number' ? end : undefined,
    start: typeof start === 'number' ? start : undefined,
  };
};

const processTextNode = (
  parent: Parent,
  node: Text,
  index: number,
  animateRanges?: Array<{ end: number; key: string; start: number }>,
  animationDurationMs?: number,
  animateFromSourceOffset?: number,
): number | undefined => {
  const text = node.value;
  if (!text.trim()) {
    return;
  }

  if (animateRanges && animateRanges.length > 0) {
    const { end, start } = getSourceOffsets(node);
    const orderedRanges = [...animateRanges].sort((left, right) => left.start - right.start);

    if (start !== undefined && end !== undefined) {
      const replacedNodes: Array<Element | Text> = [];
      let cursor = start;

      for (const range of orderedRanges) {
        const rangeStart = Math.max(range.start, start);
        const rangeEnd = Math.min(range.end, end);
        if (rangeEnd <= rangeStart) continue;

        if (cursor < rangeStart) {
          replacedNodes.push(makeText(text.slice(cursor - start, rangeStart - start)));
        }

        const animatedText = text.slice(rangeStart - start, rangeEnd - start);
        replacedNodes.push(
          ...splitAnimatedSegment(animatedText, `${range.key}-${rangeStart}`, animationDurationMs),
        );

        cursor = rangeEnd;
      }

      if (cursor < end) {
        replacedNodes.push(makeText(text.slice(cursor - start)));
      }

      if (replacedNodes.length === 0) return;

      parent.children.splice(index, 1, ...replacedNodes);
      return index + replacedNodes.length;
    }

    const fallbackSpanKey = `stream-ranges-${index}`;
    const animatedNodes = splitAnimatedSegment(text, fallbackSpanKey, animationDurationMs);
    parent.children.splice(index, 1, ...animatedNodes);
    return index + animatedNodes.length;
  }

  if (animateFromSourceOffset !== undefined) {
    const { end, start } = getSourceOffsets(node);
    const spanKeySuffix = start !== undefined ? start : index;
    const spanKey = `stream-${animateFromSourceOffset}-${spanKeySuffix}`;

    if (start !== undefined && end !== undefined) {
      if (animateFromSourceOffset <= start) {
        const animatedNodes = splitAnimatedSegment(text, spanKey, animationDurationMs);
        parent.children.splice(index, 1, ...animatedNodes);
        return index + animatedNodes.length;
      }

      if (animateFromSourceOffset >= end) {
        return;
      }

      const splitPoint = animateFromSourceOffset - start;
      const stablePart = text.slice(0, splitPoint);
      const incomingPart = text.slice(splitPoint);
      const replacedNodes: Array<Element | Text> = [];

      if (stablePart) replacedNodes.push(makeText(stablePart));
      replacedNodes.push(...splitAnimatedSegment(incomingPart, spanKey, animationDurationMs));

      parent.children.splice(index, 1, ...replacedNodes);
      return index + replacedNodes.length;
    }

    const animatedNodes = splitAnimatedSegment(text, spanKey, animationDurationMs);
    parent.children.splice(index, 1, ...animatedNodes);
    return index + animatedNodes.length;
  }

  const nodes = splitByWord(text).map((part) =>
    WHITESPACE_ONLY_RE.test(part) ? makeText(part) : makeSpan(part),
  );

  parent.children.splice(index, 1, ...nodes);
  return index + nodes.length;
};

const walk = (
  node: Parent,
  animateRanges?: Array<{ end: number; key: string; start: number }>,
  animationDurationMs?: number,
  animateFromSourceOffset?: number,
): void => {
  if (isElement(node) && SKIP_TAGS.has(node.tagName)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    let child = node.children[index];

    // remend turns incomplete links into `streamdown:incomplete-link` anchors.
    // Converting them back to text keeps node shape stable and avoids replaying
    // animation when the temporary link later resolves to plain markdown text.
    if (isElement(child) && isIncompleteRemendLink(child)) {
      child = { type: 'text', value: `[${getTextContent(child)}]` };
      node.children[index] = child;
    }

    if (child.type === 'text') {
      const nextIndex = processTextNode(
        node,
        child,
        index,
        animateRanges,
        animationDurationMs,
        animateFromSourceOffset,
      );
      if (nextIndex !== undefined) {
        index = nextIndex - 1;
      }
      continue;
    }

    if (isParentNode(child)) {
      walk(child, animateRanges, animationDurationMs, animateFromSourceOffset);
    }
  }
};

export const rehypeStreamAnimated = (options: RehypeStreamAnimatedOptions = {}) => {
  return (tree: Root) => {
    walk(tree, options.animateRanges, options.animationDurationMs, options.animateFromSourceOffset);
  };
};
