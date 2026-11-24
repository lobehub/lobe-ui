import { cleanup, fireEvent, render } from '@testing-library/react';

import Favicon from './Favicon';
import { getFaviconHost } from './utils';

describe('Favicon', () => {
  afterEach(cleanup);

  test('derives the host from a url and tolerates bad input', () => {
    expect(getFaviconHost('https://github.com/lobehub')).toBe('github.com');
    expect(getFaviconHost('github.com')).toBe('github.com');
    expect(getFaviconHost('not a url')).toBeUndefined();
    expect(getFaviconHost('')).toBeUndefined();
    expect(getFaviconHost(undefined)).toBeUndefined();
  });

  test('requests the icon for the host', () => {
    const { container } = render(<Favicon size={20} url="https://github.com/lobehub" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('https://icons.duckduckgo.com/ip3/github.com.ico');
    expect(img.getAttribute('alt')).toBe('');
    expect((container.firstElementChild as HTMLElement).style.width).toBe('20px');
  });

  test('host wins over url, src wins over both, and getIconUrl swaps the provider', () => {
    const { container, rerender } = render(<Favicon host="a.com" url="https://b.com" />);
    expect(container.querySelector('img')!.getAttribute('src')).toContain('a.com');

    rerender(<Favicon host="a.com" src="https://cdn.example/icon.png" />);
    expect(container.querySelector('img')!.getAttribute('src')).toBe(
      'https://cdn.example/icon.png',
    );

    rerender(<Favicon getIconUrl={(host) => `/favicon?host=${host}`} host="a.com" />);
    expect(container.querySelector('img')!.getAttribute('src')).toBe('/favicon?host=a.com');
  });

  test('an unusable url renders the fallback instead of throwing', () => {
    const { container } = render(<Favicon url="not a url" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-fallback')).toBe(true);
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('svg')).toBeTruthy();
  });

  test('a failed load falls back, and a new source gets a fresh attempt', () => {
    const { container, rerender } = render(<Favicon fallback={<i>?</i>} host="a.com" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toBe('?');

    rerender(<Favicon fallback={<i>?</i>} host="b.com" />);
    expect(container.querySelector('img')!.getAttribute('src')).toContain('b.com');
  });
});
