import { addRecent, readRecents, removeRecent } from './recentStore';

const STORAGE_KEY = 'lobedocs:search-recents';

describe('recentStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads an empty list when nothing is stored', () => {
    expect(readRecents()).toEqual([]);
  });

  it('adds an entry and reads it back', () => {
    addRecent({ pathname: '/components/button', title: 'Button' });
    expect(readRecents()).toEqual([{ pathname: '/components/button', title: 'Button' }]);
  });

  it('orders entries most-recent-first', () => {
    addRecent({ pathname: '/a', title: 'A' });
    addRecent({ pathname: '/b', title: 'B' });
    expect(readRecents().map((entry) => entry.pathname)).toEqual(['/b', '/a']);
  });

  it('re-bumps an existing pathname to the front and updates its fields', () => {
    addRecent({ pathname: '/a', title: 'A' });
    addRecent({ pathname: '/b', title: 'B' });
    addRecent({ category: 'Components', pathname: '/a', title: 'A updated' });
    const recents = readRecents();
    expect(recents.map((entry) => entry.pathname)).toEqual(['/a', '/b']);
    expect(recents[0]).toEqual({ category: 'Components', pathname: '/a', title: 'A updated' });
  });

  it('caps the list at 5 entries', () => {
    for (let index = 0; index < 7; index += 1) {
      addRecent({ pathname: `/page-${index}`, title: `Page ${index}` });
    }
    const recents = readRecents();
    expect(recents).toHaveLength(5);
    expect(recents.map((entry) => entry.pathname)).toEqual([
      '/page-6',
      '/page-5',
      '/page-4',
      '/page-3',
      '/page-2',
    ]);
  });

  it('removes an entry by pathname', () => {
    addRecent({ pathname: '/a', title: 'A' });
    addRecent({ pathname: '/b', title: 'B' });
    removeRecent('/a');
    expect(readRecents().map((entry) => entry.pathname)).toEqual(['/b']);
  });

  it('returns an empty list when stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(readRecents()).toEqual([]);
  });

  it('returns an empty list when stored JSON is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
    expect(readRecents()).toEqual([]);
  });

  it('drops entries missing pathname or title on read', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { pathname: '/valid', title: 'Valid' },
        { title: 'Missing pathname' },
        { pathname: '/missing-title' },
      ]),
    );
    expect(readRecents()).toEqual([{ pathname: '/valid', title: 'Valid' }]);
  });

  it('degrades to a no-op when localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => addRecent({ pathname: '/a', title: 'A' })).not.toThrow();
    spy.mockRestore();
  });

  it('degrades to an empty list when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('not available');
    });
    expect(readRecents()).toEqual([]);
    spy.mockRestore();
  });

  it('degrades to a no-op when removeRecent hits a throwing store', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => removeRecent('/a')).not.toThrow();
    spy.mockRestore();
  });
});
