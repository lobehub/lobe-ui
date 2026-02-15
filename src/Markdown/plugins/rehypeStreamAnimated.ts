import { type Element, type Parent, type Root, type Text } from 'hast';

const WHITESPACE_RE = /\s/;
const WHITESPACE_ONLY_RE = /^\s+$/;
const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const SKIP_TAGS = new Set(['code', 'pre', 'svg', 'math', 'annotation']);
const ANIMATION_CLASS_NAME = 'animate-stream';
const INCOMPLETE_LINK_PROTOCOL = 'streamdown:incomplete-link';
const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'word' })
    : null;

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

    if (!segmenter) {
      parts.push(...Array.from(part));
      continue;
    }

    const segments = Array.from(segmenter.segment(part), (item) => item.segment).filter(Boolean);
    parts.push(...(segments.length ? segments : [part]));
  }

  return parts;
};

const makeSpan = (word: string): Element => ({
  children: [{ type: 'text', value: word }],
  properties: {
    className: ANIMATION_CLASS_NAME,
  },
  tagName: 'span',
  type: 'element',
});

const processTextNode = (parent: Parent, node: Text, index: number): number | undefined => {
  const text = node.value;
  if (!text.trim()) {
    return;
  }

  const nodes = splitByWord(text).map((part) =>
    WHITESPACE_ONLY_RE.test(part) ? ({ type: 'text', value: part } as Text) : makeSpan(part),
  );

  parent.children.splice(index, 1, ...nodes);
  return index + nodes.length;
};

const walk = (node: Parent): void => {
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
      const nextIndex = processTextNode(node, child, index);
      if (nextIndex !== undefined) {
        index = nextIndex - 1;
      }
      continue;
    }

    if (isParentNode(child)) {
      walk(child);
    }
  }
};

export const rehypeStreamAnimated = () => {
  return (tree: Root) => {
    walk(tree);
  };
};
