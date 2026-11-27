import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import EntityCard from './EntityCard';

const props = {
  badge: { color: 'success' as const, label: 'In stock' },
  description: 'A light pack.',
  meta: '$89',
  rating: 4.6,
  ratingCount: 312,
  subtitle: 'Backpacks',
  title: 'Trailhead Daypack 22L',
};

describe('EntityCard', () => {
  afterEach(cleanup);

  test('renders every part in the default variant', () => {
    const { container } = render(<EntityCard {...props} image="https://example.com/a.png" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    expect(screen.getByText('Trailhead Daypack 22L')).toBeTruthy();
    expect(screen.getByText('In stock')).toBeTruthy();
    expect(screen.getByRole('img', { name: '4.6 out of 5' })).toBeTruthy();
    expect(screen.getByText('(312)')).toBeTruthy();
    expect(screen.getByText('$89')).toBeTruthy();
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('Trailhead Daypack 22L');
    expect(root.getAttribute('role')).toBeNull();
  });

  test('a2ui variant: badge tone, text stars and at most three pill actions', () => {
    const onAction = vi.fn();
    const { container } = render(
      <EntityCard
        {...props}
        variant="a2ui"
        actions={[
          { label: 'One', variant: 'solid' },
          { label: 'Two' },
          { label: 'Three' },
          { label: 'Four' },
        ]}
        onAction={onAction}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(screen.getByText('In stock').dataset.tone).toBe('success');
    expect(container.querySelectorAll('.lobe-entity-card__stars svg[data-filled]')).toHaveLength(5);
    const buttons = container.querySelectorAll('.lobe-entity-card__action');
    expect(buttons).toHaveLength(3);
    fireEvent.click(buttons[1]);
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ label: 'Two' }), 1);
  });

  test('href or onClick makes the card a link-like control', () => {
    const onClick = vi.fn();
    const { container } = render(
      <EntityCard layout="horizontal" title="Tartine" variant="a2ui" onClick={onClick} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('role')).toBe('link');
    expect(root.dataset.layout).toBe('horizontal');
    fireEvent.keyDown(root, { key: 'Enter' });
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
