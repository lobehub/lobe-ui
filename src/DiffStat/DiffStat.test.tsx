import { cleanup, render } from '@testing-library/react';

import DiffStat from './DiffStat';

describe('DiffStat', () => {
  afterEach(cleanup);

  test('shows both sides whenever either is non-zero', () => {
    const { container } = render(<DiffStat additions={13} />);
    expect(container.textContent).toBe('+13−0');
  });

  test('hideZero drops the zero side', () => {
    const { container, rerender } = render(<DiffStat hideZero additions={13} />);
    expect(container.textContent).toBe('+13');
    rerender(<DiffStat hideZero deletions={28} />);
    expect(container.textContent).toBe('−28');
  });

  test('renders nothing without counts or a kind', () => {
    const { container } = render(<DiffStat />);
    expect(container.firstChild).toBeNull();
  });

  test('kind renders a dot, even when both counts are zero', () => {
    const { container } = render(<DiffStat kind="renamed" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.kind).toBe('renamed');
    expect(root.querySelector('.lobe-diff-stat__kind')).toBeTruthy();
    expect(root.textContent).toBe('');
  });
});
