import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Pagination from '../Pagination';

afterEach(cleanup);

describe('Pagination jump items', () => {
  it('renders one-line dots plus a hover chevron and jumps by the step on click', () => {
    const onChange = vi.fn();
    render(<Pagination current={3} total={343_350} onChange={onChange} />);
    const next = screen.getByTitle('Next 5 Pages');
    expect(next.tagName).toBe('BUTTON');
    expect(next.textContent).toBe('•••');
    expect(next.querySelector('svg')).toBeTruthy();
    fireEvent.click(next);
    expect(onChange).toHaveBeenCalledWith(8, 10);
  });

  it('jump-prev clamps to page 1 and is disabled with the pagination', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Pagination current={7} total={343_350} onChange={onChange} />);
    fireEvent.click(screen.getByTitle('Previous 5 Pages'));
    expect(onChange).toHaveBeenCalledWith(2, 10);
    rerender(<Pagination disabled current={7} total={343_350} onChange={onChange} />);
    expect((screen.getByTitle('Previous 5 Pages') as HTMLButtonElement).disabled).toBe(true);
  });
});
