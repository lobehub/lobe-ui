import { clampPage, getPageCount, getPaginationItems } from '../helpers';

describe('getPageCount', () => {
  test('rounds up and floors at 1', () => {
    expect(getPageCount(100, 10)).toBe(10);
    expect(getPageCount(1, 10)).toBe(1);
    expect(getPageCount(0, 10)).toBe(1);
  });
});

describe('clampPage', () => {
  test('clamps within [1, pageCount]', () => {
    expect(clampPage(0, 10)).toBe(1);
    expect(clampPage(11, 10)).toBe(10);
    expect(clampPage(5, 10)).toBe(5);
  });
});

describe('getPaginationItems', () => {
  test('shows every page when the page count is small', () => {
    expect(getPaginationItems(1, 1)).toEqual([1]);
    expect(getPaginationItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('current at the first page', () => {
    expect(getPaginationItems(1, 20)).toEqual([1, 2, 3, 'ellipsis-next', 20]);
  });

  test('current at the third page keeps a contiguous run from 1', () => {
    expect(getPaginationItems(3, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-next', 20]);
  });

  test('current in the middle shows both ellipses', () => {
    expect(getPaginationItems(10, 20)).toEqual([
      1,
      'ellipsis-prev',
      8,
      9,
      10,
      11,
      12,
      'ellipsis-next',
      20,
    ]);
  });

  test('current at the last page', () => {
    expect(getPaginationItems(20, 20)).toEqual([1, 'ellipsis-prev', 18, 19, 20]);
  });

  test('current near the end keeps a contiguous run to the last page', () => {
    expect(getPaginationItems(18, 20)).toEqual([1, 'ellipsis-prev', 16, 17, 18, 19, 20]);
  });
});
