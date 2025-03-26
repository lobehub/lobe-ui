import { describe, expect, it } from 'vitest';

import {
  normalizeThinkTags,
  remarkCaptureThink,
} from '../src/Markdown/demos/thinking/remarkPlugin';

describe('normalizeThinkTags', () => {
  it('should normalize think tags with content', () => {
    const input = '<think>test content</think>';
    const result = normalizeThinkTags(input);
    expect(result).toBe('<think>\n\ntest content\n\n</think>');
  });

  it('should handle empty think tags', () => {
    const input = '<think></think>';
    const result = normalizeThinkTags(input);
    expect(result).toBe('<think>\n\n</think>');
  });

  it('should handle multiple think tags', () => {
    const input = '<think>content 1</think><think>content 2</think>';
    const result = normalizeThinkTags(input);
    expect(result).toBe('<think>\n\ncontent 1\n\n</think>\n\n<think>\n\ncontent 2\n\n</think>');
  });

  it('should handle think tags with newlines', () => {
    const input = '<think>\ntest\ncontent\n</think>';
    const result = normalizeThinkTags(input);
    expect(result).toBe('<think>\n\ntest\ncontent\n\n</think>');
  });

  it('should handle text without think tags', () => {
    const input = 'regular text content';
    const result = normalizeThinkTags(input);
    expect(result).toBe('regular text content');
  });

  it('should handle mixed content', () => {
    const input = 'before<think>inside</think>after';
    const result = normalizeThinkTags(input);
    expect(result).toBe('before\n\n<think>\n\ninside\n\n</think>\n\nafter');
  });
});

describe('remarkCaptureThink', () => {
  it('should return a function', () => {
    const plugin = remarkCaptureThink();
    expect(typeof plugin).toBe('function');
  });

  it('should handle empty tree', () => {
    const plugin = remarkCaptureThink();
    const emptyTree = {};
    expect(() => plugin(emptyTree)).not.toThrow();
  });

  it('should handle tree with no children', () => {
    const plugin = remarkCaptureThink();
    const tree = { type: 'root' };
    expect(() => plugin(tree)).not.toThrow();
  });
});
