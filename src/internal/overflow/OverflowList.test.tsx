import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fitCount, OverflowList } from '.';

describe('fitCount', () => {
  it('keeps every item when they all fit without the rest tag', () => {
    expect(fitCount([40, 40, 40], 30, 120)).toBe(3);
  });

  it('reserves room for the rest tag once something overflows', () => {
    expect(fitCount([40, 40, 40, 40], 30, 120)).toBe(2);
  });

  it('folds everything when the container is unmeasured', () => {
    expect(fitCount([40, 40], 30, 0)).toBe(0);
  });
});

describe('OverflowList', () => {
  const props = {
    classNames: { item: 'item', rest: 'rest', root: 'root' },
    data: ['a', 'b', 'c', 'd'],
    itemKey: (item: string) => item,
    renderItem: (item: string) => <span className="tag">{item}</span>,
    renderRest: (omitted: string[]) => <span className="tag">+ {omitted.length}</span>,
  };
  const visibleTags = (container: HTMLElement) =>
    [...container.querySelectorAll<HTMLElement>('.root > :not([aria-hidden]) .tag')].map(
      (tag) => tag.textContent,
    );

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('slices to a numeric maxCount and renders the rest', () => {
    const { container } = render(<OverflowList {...props} maxCount={2} />);
    expect(visibleTags(container)).toEqual(['a', 'b', '+ 2']);
    expect(container.querySelector('.rest')).toBeTruthy();
  });

  it('renders everything without maxCount', () => {
    const { container } = render(<OverflowList {...props} />);
    expect(visibleTags(container)).toEqual(['a', 'b', 'c', 'd']);
    expect(container.querySelector('.rest')).toBeNull();
  });

  it('measures the items for responsive and hides the ones that do not fit', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('root') ? 130 : 0;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return { width: this.classList.contains('rest') ? 30 : 40 } as DOMRect;
    });
    const { container } = render(<OverflowList {...props} maxCount="responsive" />);
    expect(visibleTags(container)).toEqual(['a', 'b', '+ 2']);
  });
});
