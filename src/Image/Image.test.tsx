import { fireEvent, render, screen } from '@testing-library/react';

import Image from './Image';
import PreviewGroup from './PreviewGroup';
import { openPreview } from './viewer/registry';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => {
      const result = fn({ css: () => '', cssVar: new Proxy({}, { get: () => '' }) });
      return new Proxy(result, { get: (_target, key) => String(key) });
    }),
  };
});

vi.mock('./viewer/registry', () => ({
  openPreview: vi.fn(),
  usePreviewSession: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Image', () => {
  it('renders an img with src, alt, and objectFit style', () => {
    render(<Image alt="cat" objectFit="contain" src="https://example.com/cat.png" />);

    const img = screen.getByAltText('cat') as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.src).toBe('https://example.com/cat.png');
    expect(img.style.objectFit).toBe('contain');
  });

  it('swaps to the fallback image on error and resets when src changes', () => {
    const { rerender } = render(<Image alt="broken" src="https://example.com/broken.png" />);
    const img = screen.getByAltText('broken') as HTMLImageElement;

    fireEvent.error(img);
    expect(img.src.startsWith('data:image/svg+xml')).toBe(true);

    rerender(<Image alt="broken" src="https://example.com/fixed.png" />);
    expect(img.src).toBe('https://example.com/fixed.png');
  });

  it('renders a skeleton placeholder while loading and preserves the click handler', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Image isLoading alt="cat" src="https://example.com/cat.png" onClick={onClick} />,
    );

    expect(screen.queryByAltText('cat')).toBeNull();

    fireEvent.click(container.firstElementChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the actions overlay only as `actionsVisible` when alwaysShowActions is set', () => {
    const { rerender } = render(
      <Image actions={<span>action</span>} src="https://example.com/cat.png" />,
    );
    const hiddenNode = screen.getByText('action').parentElement as HTMLElement;
    expect(hiddenNode.className).toContain('actionsHidden');
    expect(hiddenNode.className).toContain('actions-hidden');

    rerender(
      <Image alwaysShowActions actions={<span>action</span>} src="https://example.com/cat.png" />,
    );
    const visibleNode = screen.getByText('action').parentElement as HTMLElement;
    expect(visibleNode.className).toContain('actionsVisible');
    expect(visibleNode.className).not.toContain('actions-hidden');
  });

  it('shows the zoom-in cursor class only when preview is enabled', () => {
    const { rerender } = render(<Image alt="cat" src="https://example.com/cat.png" />);
    expect(screen.getByAltText('cat').className).toContain('previewable');

    rerender(<Image alt="cat" preview={false} src="https://example.com/cat.png" />);
    expect(screen.getByAltText('cat').className).not.toContain('previewable');
  });

  it('calls openPreview with a resolved entry on click when preview is enabled', () => {
    render(<Image alt="cat" src="https://example.com/cat.png" />);

    fireEvent.click(screen.getByAltText('cat'));

    expect(openPreview).toHaveBeenCalledTimes(1);
    const entry = (openPreview as any).mock.calls[0][0];
    expect(entry.src).toBe('https://example.com/cat.png');
    expect(entry.options.maxScale).toBe(8);
  });

  it('does not call openPreview when preview is false', () => {
    render(<Image alt="cat" preview={false} src="https://example.com/cat.png" />);

    fireEvent.click(screen.getByAltText('cat'));

    expect(openPreview).not.toHaveBeenCalled();
  });

  it('lets a per-image preview=false override an enabled group preview', () => {
    render(
      <PreviewGroup preview={{ maxScale: 4 }}>
        <Image alt="cat" preview={false} src="https://example.com/cat.png" />
      </PreviewGroup>,
    );

    expect(screen.getByAltText('cat').className).not.toContain('previewable');

    fireEvent.click(screen.getByAltText('cat'));
    expect(openPreview).not.toHaveBeenCalled();
  });
});
