import { fireEvent, render, screen } from '@testing-library/react';

import PageHelpful from './PageHelpful';

it('records a local helpful response without an external side effect', () => {
  const { container } = render(<PageHelpful pathname="/components/button" />);

  expect(screen.getByText('Was this page helpful?')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

  expect(screen.getByRole('status').textContent).toContain('Thanks for the feedback');
  expect(container.firstElementChild?.getAttribute('data-pagefind-ignore')).toBe('all');
});

it('resets the local confirmation when the documentation pathname changes', () => {
  const { rerender } = render(<PageHelpful pathname="/components/button" />);
  fireEvent.click(screen.getByRole('button', { name: 'No' }));
  expect(screen.getByRole('status')).toBeTruthy();

  rerender(<PageHelpful pathname="/components/input" />);

  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByRole('button', { name: 'Yes' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'No' })).toBeTruthy();

  rerender(<PageHelpful pathname="/components/button" />);
  expect(screen.queryByRole('status')).toBeNull();
});
