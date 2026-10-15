import { describe, expect, test } from 'vitest';

import { filterFilesByAccept, matchesAccept } from '../helpers';

const file = (name: string, type: string) => new File(['x'], name, { type });

describe('matchesAccept', () => {
  test('matches everything when accept is not provided', () => {
    expect(matchesAccept(file('a.png', 'image/png'))).toBe(true);
  });

  test('matches by mime type', () => {
    expect(matchesAccept(file('a.png', 'image/png'), 'image/png')).toBe(true);
    expect(matchesAccept(file('a.pdf', 'application/pdf'), 'image/png')).toBe(false);
  });

  test('matches by wildcard mime type', () => {
    expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true);
    expect(matchesAccept(file('a.pdf', 'application/pdf'), 'image/*')).toBe(false);
  });

  test('matches by extension', () => {
    expect(matchesAccept(file('a.md', ''), '.md')).toBe(true);
    expect(matchesAccept(file('a.md', ''), '.skill,.md')).toBe(true);
    expect(matchesAccept(file('a.txt', ''), '.md')).toBe(false);
  });

  test('matches against any pattern in a comma-separated list', () => {
    expect(matchesAccept(file('a.png', 'image/png'), '.pdf,image/*')).toBe(true);
  });
});

describe('filterFilesByAccept', () => {
  test('returns all files when accept is not provided', () => {
    const files = [file('a.png', 'image/png'), file('b.pdf', 'application/pdf')];
    expect(filterFilesByAccept(files)).toEqual(files);
  });

  test('drops files that do not match accept', () => {
    const png = file('a.png', 'image/png');
    const pdf = file('b.pdf', 'application/pdf');
    expect(filterFilesByAccept([png, pdf], 'image/*')).toEqual([png]);
  });
});
