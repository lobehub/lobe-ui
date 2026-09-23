import { fireEvent, render, screen } from '@testing-library/react';

import LandingHero from './LandingHero';

it('renders actions as anchors and opens absolute URLs in a new tab', () => {
  render(
    <LandingHero
      accent="Kit"
      background={false}
      title="Example"
      actions={[
        { href: '/docs', label: 'Get Started', primary: true },
        { href: 'https://github.com/example', label: 'GitHub' },
      ]}
    />,
  );

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Example Kit');
  expect(screen.getByRole('link', { name: 'Get Started' }).getAttribute('target')).toBeNull();
  expect(screen.getByRole('link', { name: 'GitHub' }).getAttribute('target')).toBe('_blank');
});

it('routes the primary action through renderLink', () => {
  render(
    <LandingHero
      actions={[{ href: '/docs', label: 'Docs', primary: true }]}
      background={false}
      title="Example"
      renderLink={({ children, className, external, href }) => (
        <button className={className} data-external={external} data-href={href} type="button">
          {children}
        </button>
      )}
    />,
  );

  const action = screen.getByRole('button', { name: 'Docs' });
  expect(action.getAttribute('data-href')).toBe('/docs');
  expect(action.getAttribute('data-external')).toBe('false');
});

it('hands internal secondary actions to onNavigate', () => {
  const onNavigate = vi.fn();
  render(
    <LandingHero
      actions={[{ href: '/guide', label: 'Guide' }]}
      background={false}
      title="Example"
      onNavigate={onNavigate}
    />,
  );

  const action = screen.getByRole('link', { name: 'Guide' });
  expect(action.getAttribute('href')).toBe('/guide');
  fireEvent.click(action);
  expect(onNavigate).toHaveBeenCalledWith('/guide');
});

it('switches to the split layout when an aside is given', () => {
  const { container } = render(
    <LandingHero aside={<div>Aside</div>} background={false} title="Example" />,
  );

  expect(container.querySelector('section')?.getAttribute('data-layout')).toBe('split');
  expect(screen.getByText('Aside')).toBeTruthy();
});
