import { type Element, type Parent, type Root, type Text } from 'hast';

import { isWhitespaceToken, splitStreamAnimationTokens } from '../streamTokens';

const WHITESPACE_ONLY_RE = /^\s+$/;
const SKIP_TAGS = new Set(['code', 'pre', 'svg', 'math', 'annotation']);
const ANIMATION_CLASS_NAME = 'animate-stream';
const INCOMPLETE_LINK_PROTOCOL = 'streamdown:incomplete-link';

export interface StreamAnimateRange {
  end: number;
  key: string;
  start: number;
  tokenDelayStartMs?: number;
  tokenDelayStepMs?: number;
}

export interface RehypeStreamAnimatedOptions {
  animateFromSourceOffset?: number;
  animateRanges?: StreamAnimateRange[];
}

interface SplitTokenSegmentOptions {
  delayStartMs?: number;
  delayStepMs?: number;
  spanKey?: string;
  tokenCursor?: number;
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

const makeSpan = (
  word: string,
  { delayMs, spanKey }: { delayMs?: number; spanKey?: string } = {},
): Element => {
  const properties: Record<string, string> = {
    className: ANIMATION_CLASS_NAME,
  };
  if (spanKey) {
    properties.key = spanKey;
  }
  if (delayMs !== undefined) {
    properties.style = `animation-delay:${Math.max(delayMs, 0)}ms;animation-fill-mode:both`;
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

const splitAnimatedSegmentAsChunk = (text: string, spanKey?: string): Array<Element | Text> => {
  if (!text) return [];
  if (WHITESPACE_ONLY_RE.test(text)) return [makeText(text)];

  const leadingMatch = text.match(/^\s+/)?.[0] ?? '';
  const trailingMatch = text.match(/\s+$/)?.[0] ?? '';
  const leadingLength = leadingMatch.length;
  const trailingLength = trailingMatch.length;
  const core = text.slice(leadingLength, text.length - trailingLength);
  const nodes: Array<Element | Text> = [];

  if (leadingMatch) nodes.push(makeText(leadingMatch));
  if (core) nodes.push(makeSpan(core, { spanKey }));
  if (trailingMatch) nodes.push(makeText(trailingMatch));

  return nodes;
};

const splitAnimatedSegmentByTokens = (
  text: string,
  options: SplitTokenSegmentOptions = {},
): { animatedTokenCount: number; nodes: Array<Element | Text> } => {
  if (!text) return { animatedTokenCount: 0, nodes: [] };
  if (WHITESPACE_ONLY_RE.test(text)) {
    return { animatedTokenCount: 0, nodes: [makeText(text)] };
  }

  const leadingMatch = text.match(/^\s+/)?.[0] ?? '';
  const trailingMatch = text.match(/\s+$/)?.[0] ?? '';
  const leadingLength = leadingMatch.length;
  const trailingLength = trailingMatch.length;
  const core = text.slice(leadingLength, text.length - trailingLength);
  const nodes: Array<Element | Text> = [];
  let animatedTokenCount = 0;

  if (leadingMatch) nodes.push(makeText(leadingMatch));

  if (core) {
    const tokens = splitStreamAnimationTokens(core);
    for (const token of tokens) {
      if (isWhitespaceToken(token)) {
        nodes.push(makeText(token));
        continue;
      }

      const tokenCursor = options.tokenCursor ?? 0;
      const tokenDelayStartMs = options.delayStartMs ?? 0;
      const tokenDelayStepMs = options.delayStepMs ?? 0;
      const delayMs = tokenDelayStartMs + (tokenCursor + animatedTokenCount) * tokenDelayStepMs;
      const spanKey = options.spanKey
        ? `${options.spanKey}-token-${tokenCursor + animatedTokenCount}`
        : undefined;

      nodes.push(makeSpan(token, { delayMs, spanKey }));
      animatedTokenCount += 1;
    }
  }

  if (trailingMatch) nodes.push(makeText(trailingMatch));

  return { animatedTokenCount, nodes };
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
  tokenCursorByRange: Map<string, number>,
  animateRanges?: StreamAnimateRange[],
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
        const tokenCursor = tokenCursorByRange.get(range.key) ?? 0;
        const tokenized = splitAnimatedSegmentByTokens(animatedText, {
          delayStartMs: range.tokenDelayStartMs,
          delayStepMs: range.tokenDelayStepMs,
          spanKey: `${range.key}-${rangeStart}`,
          tokenCursor,
        });

        replacedNodes.push(...tokenized.nodes);
        tokenCursorByRange.set(range.key, tokenCursor + tokenized.animatedTokenCount);
        cursor = rangeEnd;
      }

      if (cursor < end) {
        replacedNodes.push(makeText(text.slice(cursor - start)));
      }

      if (replacedNodes.length === 0) return;

      parent.children.splice(index, 1, ...replacedNodes);
      return index + replacedNodes.length;
    }

    const fallbackRange = orderedRanges.at(-1);
    const fallbackCursor = fallbackRange ? (tokenCursorByRange.get(fallbackRange.key) ?? 0) : 0;
    const fallbackNodes = splitAnimatedSegmentByTokens(text, {
      delayStartMs: fallbackRange?.tokenDelayStartMs,
      delayStepMs: fallbackRange?.tokenDelayStepMs,
      spanKey: `stream-ranges-${index}`,
      tokenCursor: fallbackCursor,
    });
    if (fallbackRange) {
      tokenCursorByRange.set(fallbackRange.key, fallbackCursor + fallbackNodes.animatedTokenCount);
    }

    parent.children.splice(index, 1, ...fallbackNodes.nodes);
    return index + fallbackNodes.nodes.length;
  }

  if (animateFromSourceOffset !== undefined) {
    const { end, start } = getSourceOffsets(node);
    const spanKeySuffix = start !== undefined ? start : index;
    const spanKey = `stream-${animateFromSourceOffset}-${spanKeySuffix}`;

    if (start !== undefined && end !== undefined) {
      if (animateFromSourceOffset <= start) {
        const animatedNodes = splitAnimatedSegmentAsChunk(text, spanKey);
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
      replacedNodes.push(...splitAnimatedSegmentAsChunk(incomingPart, spanKey));

      parent.children.splice(index, 1, ...replacedNodes);
      return index + replacedNodes.length;
    }

    const animatedNodes = splitAnimatedSegmentAsChunk(text, spanKey);
    parent.children.splice(index, 1, ...animatedNodes);
    return index + animatedNodes.length;
  }

  const nodes = splitStreamAnimationTokens(text).map((part) =>
    isWhitespaceToken(part) ? makeText(part) : makeSpan(part),
  );

  parent.children.splice(index, 1, ...nodes);
  return index + nodes.length;
};

const walk = (
  node: Parent,
  tokenCursorByRange: Map<string, number>,
  animateRanges?: StreamAnimateRange[],
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
        tokenCursorByRange,
        animateRanges,
        animateFromSourceOffset,
      );
      if (nextIndex !== undefined) {
        index = nextIndex - 1;
      }
      continue;
    }

    if (isParentNode(child)) {
      walk(child, tokenCursorByRange, animateRanges, animateFromSourceOffset);
    }
  }
};

export const rehypeStreamAnimated = (options: RehypeStreamAnimatedOptions = {}) => {
  return (tree: Root) => {
    const tokenCursorByRange = new Map<string, number>();
    walk(tree, tokenCursorByRange, options.animateRanges, options.animateFromSourceOffset);
  };
};
