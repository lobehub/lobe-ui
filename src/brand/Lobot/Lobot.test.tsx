import { render } from '@testing-library/react';

import Lobot from './Lobot';
import { brandLobotClasses } from './stable';

const part = (container: HTMLElement, name: 'logo' | 'text' | 'divider' | 'extra') =>
  container.querySelector(`.${brandLobotClasses(name)}`);

describe('Lobot', () => {
  test('renders the mark as the root by default', () => {
    const { container } = render(<Lobot data-testid="brand" size={40} />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('svg');
    expect(root.classList.contains(brandLobotClasses())).toBe(true);
    expect(root.getAttribute('data-type')).toBe('mono');
    expect(root.getAttribute('data-testid')).toBe('brand');
    expect(root.getAttribute('width')).toBe('40');
  });

  test('scales the wordmark from the mark size in every type', () => {
    const text = render(<Lobot size={100} type="text" />).container.firstElementChild!;
    expect(text.getAttribute('viewBox')).toBe('0 0 82 24');
    expect(text.getAttribute('height')).toBe('70');

    const { container } = render(<Lobot size={100} type="combine" />);
    expect(container.firstElementChild!.getAttribute('data-type')).toBe('combine');
    expect(part(container, 'logo')!.getAttribute('height')).toBe('100');
    expect(part(container, 'text')!.getAttribute('height')).toBe('70');
  });

  test('adds the divider and extra after any type', () => {
    for (const type of ['mono', 'text', 'combine'] as const) {
      const { container, unmount } = render(<Lobot extra="Discover" type={type} />);
      expect(container.firstElementChild!.tagName).toBe('DIV');
      expect(part(container, 'divider')).toBeTruthy();
      expect(part(container, 'extra')!.textContent).toBe('Discover');
      expect(!!part(container, 'logo')).toBe(type !== 'text');
      expect(!!part(container, 'text')).toBe(type !== 'mono');
      unmount();
    }
  });
});
