import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import Freeze from './Freeze';

const hasInlineDisplayNoneInAncestors = (node: HTMLElement | null) => {
  let current = node;

  while (current) {
    if (current.style.display === 'none') return true;
    current = current.parentElement;
  }

  return false;
};

const Demo = () => {
  const [frozen, setFrozen] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <>
      <button type="button" onClick={() => setFrozen((value) => !value)}>
        toggle-freeze
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        increment
      </button>
      <Freeze frozen={frozen}>
        <span data-testid="count">{count}</span>
      </Freeze>
    </>
  );
};

describe('Freeze', () => {
  it('keeps previous content while frozen and resumes after unfreeze', async () => {
    render(<Demo />);

    const incrementButton = screen.getByRole('button', { name: 'increment' });
    const toggleButton = screen.getByRole('button', { name: 'toggle-freeze' });

    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(incrementButton);
    expect(screen.getByTestId('count').textContent).toBe('1');

    fireEvent.click(toggleButton);
    fireEvent.click(incrementButton);

    await waitFor(() => {
      expect(hasInlineDisplayNoneInAncestors(screen.getByTestId('count'))).toBe(false);
    });
    expect(screen.getByTestId('count').textContent).toBe('1');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('does not mutate child inline display style', () => {
    render(
      <Freeze frozen>
        <span data-testid="hidden-child" style={{ display: 'none' }}>
          hidden
        </span>
      </Freeze>,
    );

    expect(screen.getByTestId('hidden-child').style.display).toBe('none');
  });
});
