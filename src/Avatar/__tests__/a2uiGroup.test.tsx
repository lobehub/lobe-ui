import { cleanup, render, screen } from '@testing-library/react';

import AvatarGroup from '../AvatarGroup';

const people = ['Maya Okafor', 'Leo Brandt', 'Priya Raman', 'Ines Duval'];

describe('AvatarGroup variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders tinted initials, a +N count and the label', () => {
    const { container } = render(
      <AvatarGroup
        items={people.map((name) => ({ key: name, title: name }))}
        label="4 reviewers"
        max={2}
        variant="a2ui"
      />,
    );

    expect(screen.getByText('MO')).toBeTruthy();
    expect(screen.getByText('LB')).toBeTruthy();
    expect(screen.queryByText('PR')).toBeNull();
    expect(screen.getByText('+2')).toBeTruthy();
    expect(screen.getByText('4 reviewers')).toBeTruthy();
    const avatar = container.querySelector<HTMLElement>('.lobe-avatar-group__avatar')!;
    expect(avatar.title).toBe('Maya Okafor');
    expect(avatar.style.getPropertyValue('--lobe-a2ui-tint-bg')).toMatch(/^var\(--lobe-\w+-3\)$/);
  });
});
