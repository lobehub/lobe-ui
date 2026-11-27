import { render, screen } from '@testing-library/react';

import ImageGallery from './ImageGallery';

const images = ['Shibuya', 'Shinjuku', 'Akihabara', 'Kyoto', 'Golden Gai', 'Tokyo Tower'].map(
  (caption, i) => ({ caption, url: `https://example.com/${i}.jpg` }),
);

describe('ImageGallery', () => {
  test('renders captioned images in the given columns', () => {
    const { container } = render(<ImageGallery columns={3} images={images} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(container.querySelectorAll('img')).toHaveLength(6);
    expect(screen.getByAltText('Kyoto')).toBeTruthy();
    expect(screen.getByText('Tokyo Tower')).toBeTruthy();
  });

  test('clamps columns to 2..4', () => {
    const { container } = render(<ImageGallery columns={9} images={images} />);
    expect((container.firstElementChild as HTMLElement).style.gridTemplateColumns).toBe(
      'repeat(4, minmax(0, 1fr))',
    );
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<ImageGallery images={images} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const item = container.querySelector('.lobe-image-gallery__item')!.className;
    rerender(<ImageGallery images={images} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelector('.lobe-image-gallery__item')!.className).not.toBe(item);
  });
});
