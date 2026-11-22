import { render } from '@testing-library/react';

import LobotBrandLoading from './LobotBrandLoading';
import { brandLobotBrandLoadingClasses } from './stable';

describe('LobotBrandLoading', () => {
  test('renders the mark at the size of LobotMono', () => {
    const { container } = render(<LobotBrandLoading />);
    const root = container.firstElementChild!;
    expect(root.classList.contains(brandLobotBrandLoadingClasses())).toBe(true);
    expect(root.getAttribute('width')).toBe('64');
    expect(root.getAttribute('height')).toBe('64');
    expect(root.querySelector('title')!.textContent).toBe('Lobot');
  });

  test('draws both bubbles and the eyes above one outline layer', () => {
    const { container } = render(<LobotBrandLoading size="2em" />);
    const root = container.firstElementChild!;
    expect(root.getAttribute('width')).toBe('2em');
    expect(container.querySelectorAll(`.${brandLobotBrandLoadingClasses('bubble')}`)).toHaveLength(
      2,
    );
    expect(container.querySelector(`.${brandLobotBrandLoadingClasses('eyes')}`)).toBeTruthy();
    // The outline layer comes first, so it never covers a black part.
    const [outline, ink] = [...root.children].filter((node) => node.tagName === 'g');
    expect(outline.getAttribute('fill')).toBe('#fff');
    expect(ink.getAttribute('fill')).toBe('#000');
    expect(ink.querySelector(`.${brandLobotBrandLoadingClasses('body')}`)).toBeTruthy();
  });
});
