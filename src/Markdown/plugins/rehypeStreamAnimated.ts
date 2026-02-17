// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT
import { type Element, type ElementContent, type Root } from 'hast';

import {
  STREAM_ANIMATION_CLASS_NAME,
  STREAM_ANIMATION_EXCLUDED_TAGS,
  STREAM_ANIMATION_PLUGIN_DEFAULTS,
  STREAM_ANIMATION_SCOPE_TAGS,
} from '@/Markdown/SyntaxMarkdown/streamAnimation.constants';

const ANIMATION_SCOPE_TAGS: ReadonlySet<string> = new Set(STREAM_ANIMATION_SCOPE_TAGS);
const EXCLUDED_TAGS: ReadonlySet<string> = new Set(STREAM_ANIMATION_EXCLUDED_TAGS);

const isElement = (node: ElementContent | Root): node is Element => node.type === 'element';

const countScopedChars = (node: ElementContent | Root, inScope: boolean): number => {
  if (node.type === 'text') {
    return inScope ? Array.from(node.value).length : 0;
  }

  if (!('children' in node) || !node.children) return 0;
  if (isElement(node) && EXCLUDED_TAGS.has(node.tagName)) return 0;

  const nextScope = inScope || (isElement(node) && ANIMATION_SCOPE_TAGS.has(node.tagName));

  return node.children.reduce(
    (sum: number, child) => sum + countScopedChars(child as ElementContent, nextScope),
    0,
  );
};

interface TransformContext {
  animateStartIndex: number;
  charDurationMs: number;
  cursor: number;
  delayStepMs: number;
}

const createAnimatedCharNode = (
  char: string,
  delayMs: number,
  charDurationMs: number,
): ElementContent => {
  return {
    children: [{ type: 'text', value: char }],
    properties: {
      className: [STREAM_ANIMATION_CLASS_NAME],
      style: `--stream-char-delay:${delayMs}ms;--stream-char-duration:${charDurationMs}ms;`,
    },
    tagName: 'span',
    type: 'element',
  };
};

const transformChildren = (
  children: ElementContent[],
  inScope: boolean,
  context: TransformContext,
): ElementContent[] => {
  const transformed: ElementContent[] = [];

  for (const child of children) {
    transformed.push(...transformNode(child, inScope, context));
  }

  return transformed;
};

const transformNode = (
  node: ElementContent,
  inScope: boolean,
  context: TransformContext,
): ElementContent[] => {
  if (node.type === 'text') {
    if (!inScope || node.value.length === 0) return [node];

    const chars = Array.from(node.value);
    const rewritten: ElementContent[] = [];
    let plainBuffer = '';

    for (const char of chars) {
      const absoluteIndex = context.cursor;
      context.cursor += 1;

      if (absoluteIndex < context.animateStartIndex) {
        plainBuffer += char;
        continue;
      }

      if (plainBuffer) {
        rewritten.push({ type: 'text', value: plainBuffer });
        plainBuffer = '';
      }

      const localIndex = absoluteIndex - context.animateStartIndex;
      const delayMs = Number((localIndex * context.delayStepMs).toFixed(2));

      rewritten.push(createAnimatedCharNode(char, delayMs, context.charDurationMs));
    }

    if (plainBuffer) {
      rewritten.push({ type: 'text', value: plainBuffer });
    }

    return rewritten.length > 0 ? rewritten : [node];
  }

  if (node.type !== 'element') {
    return [node];
  }

  if (EXCLUDED_TAGS.has(node.tagName)) {
    return [node];
  }

  const nextScope = inScope || ANIMATION_SCOPE_TAGS.has(node.tagName);
  if (!node.children || node.children.length === 0) {
    return [node];
  }

  return [
    {
      ...node,
      children: transformChildren(node.children as ElementContent[], nextScope, context),
    },
  ];
};

export interface RehypeStreamAnimatedOptions {
  charDurationMs?: number;
  delayStepMs?: number;
  tailChars?: number;
}

export const rehypeStreamAnimated = (options: RehypeStreamAnimatedOptions = {}) => {
  const tailChars = Math.max(
    0,
    Math.floor(options.tailChars ?? STREAM_ANIMATION_PLUGIN_DEFAULTS.tailChars),
  );
  const delayStepMs = Math.max(0, options.delayStepMs ?? 0);
  const charDurationMs = Math.max(
    STREAM_ANIMATION_PLUGIN_DEFAULTS.minCharDurationMs,
    options.charDurationMs ?? STREAM_ANIMATION_PLUGIN_DEFAULTS.charDurationMs,
  );

  return (tree: Root) => {
    if (tailChars <= 0) return;

    const totalScopedChars = countScopedChars(tree, false);
    if (totalScopedChars <= 0) return;

    const animateStartIndex = Math.max(0, totalScopedChars - tailChars);
    const context: TransformContext = {
      animateStartIndex,
      charDurationMs,
      cursor: 0,
      delayStepMs,
    };

    tree.children = transformChildren(tree.children as ElementContent[], false, context);
  };
};
