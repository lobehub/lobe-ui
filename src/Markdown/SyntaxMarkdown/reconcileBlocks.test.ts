import { describe, expect, it } from 'vitest';

import { type ParsedBlock, type RenderBlock } from './blockRenderKind';
import { computeExactLcsPairs, reconcileBlocks } from './reconcileBlocks';

const makeCurrent = (raw: string, renderKind: string): ParsedBlock => ({ raw, renderKind });
const makePrevious = (
  id: string,
  raw: string,
  renderKind: string,
  disableAnimation: boolean = false,
): RenderBlock => ({ disableAnimation, id, raw, renderKind });

describe('reconcileBlocks', () => {
  it('should preserve ids for exact matches via lcs', () => {
    const previous = [makePrevious('b0', 'A', 'paragraph'), makePrevious('b1', 'C', 'paragraph')];
    const current = [
      makeCurrent('A', 'paragraph'),
      makeCurrent('B', 'paragraph'),
      makeCurrent('C', 'paragraph'),
    ];

    const reconciled = reconcileBlocks(previous, current, () => 'new');

    expect(reconciled[0].id).toBe('b0');
    expect(reconciled[2].id).toBe('b1');
    expect(reconciled[1].id).toBe('new');
  });

  it('should keep same id and disable animation when tag changes for evolving block', () => {
    const previous = [makePrevious('b0', 'Title line\n', 'paragraph')];
    const current = [makeCurrent('Title line\n---\n', 'heading-2')];

    const reconciled = reconcileBlocks(previous, current, () => 'new');

    expect(reconciled[0].id).toBe('b0');
    expect(reconciled[0].disableAnimation).toBe(true);
  });

  it('should preserve disableAnimation once it is set for a block', () => {
    const previous = [makePrevious('b0', 'Title line\n---\n', 'heading-2', true)];
    const current = [makeCurrent('Title line\n---\nmore', 'heading-2')];

    const reconciled = reconcileBlocks(previous, current, () => 'new');

    expect(reconciled[0].id).toBe('b0');
    expect(reconciled[0].disableAnimation).toBe(true);
  });

  it('should keep same id for short-line remend-style corrections', () => {
    const previous = [makePrevious('b0', 'This text contains:_\n', 'paragraph')];
    const current = [makeCurrent('This text contains:\n', 'paragraph')];

    const reconciled = reconcileBlocks(previous, current, () => 'new');

    expect(reconciled[0].id).toBe('b0');
    expect(reconciled[0].disableAnimation).toBe(false);
  });

  it('should not leak disableAnimation to following blocks after heading conversion', () => {
    const previous = [
      makePrevious(
        'b0',
        'Emoji math line\nUnicode mix line\nBracket line\n---\n',
        'heading-2',
        true,
      ),
      makePrevious('b1', 'This text contains:_\n', 'paragraph'),
    ];
    const current = [
      makeCurrent('Emoji math line\nUnicode mix line\nBracket line\n---\n', 'heading-2'),
      makeCurrent('This text contains:\n', 'paragraph'),
      makeCurrent('1. item\n', 'list-ol'),
    ];

    let nextId = 2;
    const reconciled = reconcileBlocks(previous, current, () => `b${nextId++}`);

    expect(reconciled[0].id).toBe('b0');
    expect(reconciled[0].disableAnimation).toBe(true);
    expect(reconciled[1].id).toBe('b1');
    expect(reconciled[1].disableAnimation).toBe(false);
    expect(reconciled[2].id).toBe('b2');
    expect(reconciled[2].disableAnimation).toBe(false);
  });
});

describe('computeExactLcsPairs', () => {
  it('should return aligned pairs for equal raw blocks', () => {
    const previous = [makePrevious('b0', 'A', 'paragraph'), makePrevious('b1', 'C', 'paragraph')];
    const current = [
      makeCurrent('A', 'paragraph'),
      makeCurrent('B', 'paragraph'),
      makeCurrent('C', 'paragraph'),
    ];

    expect(computeExactLcsPairs(previous, current)).toEqual([
      [0, 0],
      [1, 2],
    ]);
  });
});
