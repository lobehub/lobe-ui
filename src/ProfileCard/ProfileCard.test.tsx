import { render, screen } from '@testing-library/react';

import ProfileCard from './ProfileCard';

const props = {
  company: 'Northwind',
  email: 'maya@northwind.dev',
  location: 'Seattle, WA',
  name: 'Maya Chen',
  phone: '+1 206 555 0142',
  role: 'Staff Engineer',
  stats: [
    { label: 'Projects', value: '24' },
    { label: 'Reviews', value: '1.2k' },
  ],
  tags: ['Rust', 'TypeScript'],
  website: 'https://mayachen.dev',
};

describe('ProfileCard', () => {
  test('renders identity, tags, stats and contact links', () => {
    const { container } = render(<ProfileCard {...props} />);
    expect(screen.getByText('Maya Chen')).toBeTruthy();
    expect(screen.getByText('MC')).toBeTruthy();
    expect(screen.getByText('at')).toBeTruthy();
    expect(screen.getByText('Northwind')).toBeTruthy();
    expect(screen.getByText('Rust')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-profile-card__stat')).toHaveLength(2);
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual([
      'mailto:maya@northwind.dev',
      'tel:+12065550142',
      'https://mayachen.dev',
    ]);
    expect(screen.getByText('mayachen.dev')).toBeTruthy();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<ProfileCard {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;
    rerender(<ProfileCard {...props} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
  });
});
