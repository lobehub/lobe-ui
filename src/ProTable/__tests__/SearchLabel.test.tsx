import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SearchLabel } from '../parts/SearchForm';

afterEach(cleanup);

describe('ProTable search label', () => {
  it('shows the full text as title only when the label cell cuts it off', () => {
    render(
      <label>
        <SearchLabel text="LongLongLongLongLabel" />
      </label>,
    );
    const el = screen.getByText('LongLongLongLongLabel');
    const box = el.closest('label')!;
    Object.defineProperty(box, 'clientWidth', { configurable: true, value: 80 });
    Object.defineProperty(box, 'scrollWidth', { configurable: true, value: 200 });
    fireEvent.mouseEnter(el);
    expect(el.getAttribute('title')).toBe('LongLongLongLongLabel');
    Object.defineProperty(box, 'scrollWidth', { configurable: true, value: 60 });
    fireEvent.mouseEnter(el);
    expect(el.getAttribute('title')).toBeNull();
  });
});
