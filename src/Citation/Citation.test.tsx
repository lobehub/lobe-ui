import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Citation from './Citation';

describe('Citation', () => {
  afterEach(cleanup);

  test('opens the card on hover with source, title, snippet and link', () => {
    const { container } = render(
      <Citation
        index={2}
        snippet="Record growth."
        title="Global Electricity Review"
        url="https://www.ember-energy.org/report"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const marker = screen.getByRole('button', { name: 'Source 2' });
    expect(marker.textContent).toBe('2');
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.mouseEnter(root);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('ember-energy.org')).toBeTruthy();
    expect(screen.getByText('Global Electricity Review')).toBeTruthy();
    expect(screen.getByText('Record growth.')).toBeTruthy();
    expect(screen.getByText('Open source').getAttribute('href')).toBe(
      'https://www.ember-energy.org/report',
    );
    fireEvent.mouseLeave(root);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('a2ui variant: label marker, click toggles, unsafe urls get no link', () => {
    const { container } = render(
      <Citation label="iea.org" title="Renewables" url="javascript:alert(1)" variant="a2ui" />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    const marker = screen.getByRole('button', { name: 'Source iea.org' });
    fireEvent.click(marker);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.queryByText('Open source')).toBeNull();
    fireEvent.click(marker);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('texts override the built-in strings', () => {
    render(<Citation texts={{ source: 'Ref {marker}' }} />);
    expect(screen.getByRole('button', { name: 'Ref 1' })).toBeTruthy();
  });
});
