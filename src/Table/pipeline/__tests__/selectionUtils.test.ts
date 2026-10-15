import { conductCheck, convertDataToEntities, flattenData, selectRange } from '../selectionUtils';

interface Node {
  children?: Node[];
  disabled?: boolean;
  key: string;
}

const tree: Node[] = [
  {
    children: [{ key: 'a1' }, { children: [{ key: 'a2x' }, { key: 'a2y' }], key: 'a2' }],
    key: 'a',
  },
  { key: 'b' },
];

const entities = convertDataToEntities(tree, (node) => node.key, 'children');
const isDisabled = (node: Node) => Boolean(node.disabled);
const sorted = (keys: Iterable<unknown>) => [...keys].map(String).sort();

describe('selectionUtils', () => {
  it('flattens tree data in display order', () => {
    expect(flattenData('children', tree).map((node) => node.key)).toEqual([
      'a',
      'a1',
      'a2',
      'a2x',
      'a2y',
      'b',
    ]);
  });

  it('builds entities with levels and parents', () => {
    expect(entities.get('a2x')?.level).toBe(2);
    expect(entities.get('a2x')?.parent?.key).toBe('a2');
    expect(entities.get('a')?.children.map((child) => child.key)).toEqual(['a1', 'a2']);
  });

  it('fills descendants and fully checked ancestors', () => {
    expect(sorted(conductCheck(['a'], true, entities, isDisabled).checkedKeys)).toEqual([
      'a',
      'a1',
      'a2',
      'a2x',
      'a2y',
    ]);
    const result = conductCheck(['a2x'], true, entities, isDisabled);
    expect(result.checkedKeys).toEqual(['a2x']);
    expect(sorted(result.halfCheckedKeys)).toEqual(['a', 'a2']);
    expect(
      sorted(conductCheck(['a1', 'a2x', 'a2y'], true, entities, isDisabled).checkedKeys),
    ).toEqual(['a', 'a1', 'a2', 'a2x', 'a2y']);
  });

  it('cleans ancestors after an uncheck', () => {
    const { checkedKeys, halfCheckedKeys } = conductCheck(
      ['a', 'a1', 'a2', 'a2y'],
      { checked: false, halfCheckedKeys: [] },
      entities,
      isDisabled,
    );
    expect(sorted(checkedKeys)).toEqual(['a1', 'a2y']);
    expect(sorted(halfCheckedKeys)).toEqual(['a', 'a2']);
  });

  it('drops unknown keys', () => {
    expect(conductCheck(['zzz', 'b'], true, entities, isDisabled).checkedKeys).toEqual(['b']);
  });

  it('selects and clears Shift ranges', () => {
    const keys = ['1', '2', '3', '4'];
    const selected = new Set(['1']);
    const first = selectRange(0, 2, keys, selected);
    expect(first).toEqual({ changedKeys: ['2', '3'], nextAnchor: 2 });
    expect(sorted(selected)).toEqual(['1', '2', '3']);

    const second = selectRange(2, 0, keys, selected);
    expect(second).toEqual({ changedKeys: ['1', '2', '3'], nextAnchor: null });
    expect(selected.size).toBe(0);
  });
});
