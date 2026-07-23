import { expect, it } from 'vitest';

import { computeCollapsedCount } from './navOverflow';

it('keeps every candidate inline when the row fits without the more button', () => {
  expect(
    computeCollapsedCount({
      available: 400,
      candidateWidths: [80, 80, 80],
      fixedWidths: [60],
      gap: 4,
      moreWidth: 36,
    }),
  ).toBe(0);
});

it('collapses only as many trailing candidates as needed to fit with the more button', () => {
  expect(
    computeCollapsedCount({
      available: 300,
      candidateWidths: [80, 80, 80, 80],
      fixedWidths: [60],
      gap: 0,
      moreWidth: 36,
    }),
  ).toBe(2);
});

it('counts flex gaps between every rendered item', () => {
  expect(
    computeCollapsedCount({
      available: 306,
      candidateWidths: [80, 80, 80],
      fixedWidths: [60],
      gap: 4,
      moreWidth: 36,
    }),
  ).toBe(1);
});

it('accounts for the more button width when deciding how much to collapse', () => {
  expect(
    computeCollapsedCount({
      available: 230,
      candidateWidths: [80, 80, 80],
      fixedWidths: [60],
      gap: 0,
      moreWidth: 50,
    }),
  ).toBe(2);
});

it('collapses everything when even the more button barely fits', () => {
  expect(
    computeCollapsedCount({
      available: 100,
      candidateWidths: [80, 80],
      fixedWidths: [60],
      gap: 0,
      moreWidth: 36,
    }),
  ).toBe(2);
});

it('returns zero for an empty candidate list', () => {
  expect(
    computeCollapsedCount({
      available: 10,
      candidateWidths: [],
      fixedWidths: [60],
      gap: 4,
      moreWidth: 36,
    }),
  ).toBe(0);
});
