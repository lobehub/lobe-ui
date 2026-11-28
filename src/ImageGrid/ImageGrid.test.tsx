import { render, screen } from '@testing-library/react';

import ImageGrid from './ImageGrid';

const images = [
  { caption: 'Shibuya', description: 'Crossing', url: 'https://example.com/0.jpg' },
  { description: 'Neon', href: 'https://example.com/page', url: 'https://example.com/1.jpg' },
  { href: 'javascript:alert(1)', url: 'https://example.com/2.jpg' },
];

describe('ImageGrid', () => {
  test('renders images with alt text, captions and safe links', () => {
    const { container } = render(<ImageGrid gap={3} images={images} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.gap).toBe('12px');
    expect(screen.getByAltText('Crossing')).toBeTruthy();
    expect(screen.getByText('Shibuya')).toBeTruthy();
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['https://example.com/page']);
  });

  test('bento gives the first image a 2x2 area', () => {
    const { container } = render(<ImageGrid images={images} layout="bento" />);
    const first = container.querySelector('.lobe-image-grid__item') as HTMLElement;
    expect(first.style.gridColumn).toBe('span 2');
    expect(first.style.gridRow).toBe('span 2');
    expect((container.firstElementChild as HTMLElement).dataset.layout).toBe('bento');
  });

  test('renders nothing without images', () => {
    const { container } = render(<ImageGrid images={[]} />);
    expect(container.firstElementChild).toBeNull();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<ImageGrid images={images} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const caption = container.querySelector('.lobe-image-grid__caption')!.className;
    rerender(<ImageGrid images={images} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelector('.lobe-image-grid__caption')!.className).not.toBe(caption);
  });
});
