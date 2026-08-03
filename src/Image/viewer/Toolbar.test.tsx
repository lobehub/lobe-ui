import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';
import imageMessages from '@/i18n/resources/en/image';

import ImageComponent from '../Image';
import type { ImagePreviewOptions } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

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

const motionMock = vi.hoisted(() => ({
  pending: [] as { run: () => void; stopped: boolean }[],
}));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return {
    ...actual,
    animate: vi.fn((value: { set: (next: unknown) => void }, target: unknown, options?: any) => {
      const task = {
        run: () => {
          value.set(target);
          options?.onComplete?.();
        },
        stopped: false,
      };
      motionMock.pending.push(task);
      return { stop: () => (task.stopped = true) };
    }),
  };
});

const toastMock = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}));

vi.mock('@/base-ui/Toast', () => ({
  ToastHost: () => null,
  toast: toastMock,
}));

const flushAnimations = () =>
  act(() => {
    const tasks = motionMock.pending.splice(0);
    for (const task of tasks) if (!task.stopped) task.run();
  });

const VIEWPORT = { height: 768, width: 1024 };
const THUMB_RECT = { height: 150, left: 100, top: 50, width: 200 };

const setViewport = ({ height, width }: { height: number; width: number }) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
    writable: true,
  });
};

const stubRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
  const resolved = { height: 0, left: 0, top: 0, width: 0, ...rect };
  element.getBoundingClientRect = () =>
    ({
      ...resolved,
      bottom: resolved.top + resolved.height,
      right: resolved.left + resolved.width,
      toJSON: () => resolved,
      x: resolved.left,
      y: resolved.top,
    }) as DOMRect;
};

const renderWithMotion = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getViewerImage = () => document.querySelector<HTMLImageElement>('.viewerImage');
const getToolbar = () => document.querySelector('.toolbar') as HTMLElement;
const getToolbarButtons = () =>
  Array.from(getToolbar().querySelectorAll<HTMLElement>('[role="button"]'));
const iconClassOf = (button: HTMLElement) =>
  button.querySelector('svg')?.getAttribute('class') ?? '';

const readTransform = () => {
  const transform = getViewerImage()?.style.transform ?? '';
  const scale = /scale\((-?[\d.]+)\)/.exec(transform);
  return { scale: Number(scale?.[1]) };
};

const openViewer = (natural = { height: 300, width: 400 }) => {
  const thumbnail = screen.getByAltText('cat') as HTMLImageElement;
  Object.defineProperty(thumbnail, 'naturalWidth', { configurable: true, value: natural.width });
  Object.defineProperty(thumbnail, 'naturalHeight', { configurable: true, value: natural.height });
  stubRect(thumbnail, THUMB_RECT);
  fireEvent.click(thumbnail);
  flushAnimations();
  return thumbnail;
};

const mount = (
  natural: { height: number; width: number } = { height: 300, width: 400 },
  preview?: ImagePreviewOptions,
) => {
  renderWithMotion(
    <ImageComponent alt="cat" preview={preview} src="https://example.com/cat.png" />,
  );
  return openViewer(natural);
};

beforeEach(() => {
  motionMock.pending.length = 0;
  toastMock.success.mockClear();
  toastMock.error.mockClear();
  setViewport(VIEWPORT);
});

const openMoreMenu = () => {
  fireEvent.click(getToolbarButtons()[4]);
  return screen.getAllByRole('menuitem');
};

describe('controls', () => {
  it('renders zoom, percentage, download and the more trigger in order', () => {
    mount();
    const buttons = getToolbarButtons();

    expect(buttons).toHaveLength(5);
    expect(iconClassOf(buttons[0])).toContain('lucide-zoom-out');
    expect(buttons[1].textContent).toBe('100%');
    expect(iconClassOf(buttons[2])).toContain('lucide-zoom-in');
    expect(iconClassOf(buttons[3])).toContain('lucide-download');
    expect(iconClassOf(buttons[4])).toContain('lucide-ellipsis');
  });

  it('collects flip, rotate and copy into the more menu', () => {
    mount();
    const items = openMoreMenu();

    expect(items).toHaveLength(5);
    expect(items.map((item) => item.textContent)).toEqual([
      imageMessages['image.flipHorizontal'],
      imageMessages['image.flipVertical'],
      imageMessages['image.rotateLeft'],
      imageMessages['image.rotateRight'],
      imageMessages['image.copy'],
    ]);
  });

  it('renders the toolbarAddon after the built-in controls', () => {
    mount(
      { height: 300, width: 400 },
      { toolbarAddon: <button data-testid="addon">Addon</button> },
    );

    expect(getToolbar().querySelector('[data-testid="addon"]')).not.toBeNull();
  });

  it('disables zoom out at scale 1', () => {
    mount();
    const zoomOutButton = getToolbarButtons()[0];

    expect(zoomOutButton.getAttribute('tabindex')).toBe('-1');
    fireEvent.click(zoomOutButton);
    expect(readTransform().scale).toBe(1);
  });

  it('disables zoom in at maxScale', () => {
    mount();
    const zoomInButton = () => getToolbarButtons()[2];

    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(zoomInButton());
      flushAnimations();
    }

    expect(readTransform().scale).toBe(8);
    expect(zoomInButton().getAttribute('tabindex')).toBe('-1');

    fireEvent.click(zoomInButton());
    flushAnimations();
    expect(readTransform().scale).toBe(8);
  });

  it('zooms in, reflects the percentage, and resets to 100% on click', () => {
    mount();
    const buttons = getToolbarButtons();
    const zoomInButton = buttons[2];
    const percentageButton = buttons[1];

    expect(percentageButton.textContent).toBe('100%');

    fireEvent.click(zoomInButton);
    flushAnimations();
    fireEvent.click(zoomInButton);
    flushAnimations();
    expect(percentageButton.textContent).toBe('225%');

    fireEvent.click(percentageButton);
    flushAnimations();

    expect(percentageButton.textContent).toBe('100%');
    expect(readTransform().scale).toBe(1);
  });

  it('re-fits the layout box to the swapped aspect when rotated from the more menu', () => {
    mount({ height: 2000, width: 4000 });
    const image = getViewerImage() as HTMLImageElement;

    expect(image.style.width).toBe('976px');
    expect(image.style.height).toBe('488px');

    const items = openMoreMenu();
    fireEvent.click(items[3]);

    expect(image.style.width).toBe('360px');
    expect(image.style.height).toBe('720px');
  });
});

describe('copy and download', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal(
      'ClipboardItem',
      vi.fn(function ClipboardItemMock(items: unknown) {
        return items;
      }),
    );
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.unstubAllGlobals();
  });

  it('copies the displayed source from the more menu and shows a success toast', async () => {
    const blob = new Blob(['x'], { type: 'image/png' });
    vi.mocked(fetch).mockResolvedValue({ blob: () => Promise.resolve(blob) } as Response);
    mount();

    fireEvent.click(openMoreMenu()[4]);

    await waitFor(() =>
      expect(toastMock.success).toHaveBeenCalledWith(imageMessages['image.copySuccess']),
    );
    expect(navigator.clipboard.write).toHaveBeenCalled();
  });

  it('shows an error toast when copy fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'));
    mount();

    fireEvent.click(openMoreMenu()[4]);

    await waitFor(() =>
      expect(toastMock.error).toHaveBeenCalledWith(imageMessages['image.copyFailed']),
    );
  });

  it('downloads the displayed source and shows a success toast', async () => {
    const blob = new Blob(['x'], { type: 'image/png' });
    vi.mocked(fetch).mockResolvedValue({ blob: () => Promise.resolve(blob) } as Response);
    mount();

    fireEvent.click(getToolbarButtons()[3]);

    await waitFor(() =>
      expect(toastMock.success).toHaveBeenCalledWith(imageMessages['image.downloadSuccess']),
    );
  });

  it('shows an error toast when download fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'));
    mount();

    fireEvent.click(getToolbarButtons()[3]);

    await waitFor(() =>
      expect(toastMock.error).toHaveBeenCalledWith(imageMessages['image.downloadFailed']),
    );
  });
});
