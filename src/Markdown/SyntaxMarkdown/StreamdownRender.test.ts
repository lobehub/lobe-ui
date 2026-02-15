import { describe, expect, it } from 'vitest';

import { getTagChangedMask, parseMarkdownIntoBlocks } from './blockRenderKind';

describe('StreamdownRender helpers', () => {
  it('should detect block tag changes at the same index', () => {
    const previousKinds = ['paragraph', 'paragraph', 'code'];
    const currentKinds = ['heading-2', 'paragraph', 'code'];

    expect(getTagChangedMask(previousKinds, currentKinds)).toEqual([true, false, false]);
  });

  it('should not mark new blocks as changed when there is no previous kind', () => {
    const previousKinds = ['paragraph'];
    const currentKinds = ['paragraph', 'paragraph'];

    expect(getTagChangedMask(previousKinds, currentKinds)).toEqual([false, false]);
  });

  it('should parse setext heading as heading block kind', () => {
    const blocks = parseMarkdownIntoBlocks('Title line\n---\n');

    expect(blocks).toHaveLength(1);
    expect(blocks[0].renderKind).toBe('heading-2');
  });
});
