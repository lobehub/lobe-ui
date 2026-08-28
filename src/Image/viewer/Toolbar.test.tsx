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
  Array.from(getToolbar().querySelectorAll<HTMLElement>('button, [role="button"]'));
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

const getPercentage = () => {
  const node = Array.from(getToolbar().querySelectorAll<HTMLElement>('*')).find(
    (element) => element.children.length === 0 && /^\d+%$/.test(element.textContent ?? ''),
  );
  if (!node) throw new Error('no percentage readout in the toolbar');
  return node;
};

const getActualSizeToggle = () => {
  const node = getToolbar().querySelector<HTMLElement>('[data-actual-size]');
  if (!node) throw new Error('no actual-size toggle in the toolbar');
  return node;
};

const toolbarButton = (icon: string) => {
  const button = getToolbarButtons().find((node) => iconClassOf(node).includes(`lucide-${icon}`));
  if (!button) throw new Error(`no toolbar button with icon ${icon}`);
  return button;
};

const openMoreMenu = () => {
  fireEvent.click(toolbarButton('ellipsis'));
  return screen.getAllByRole('menuitem');
};

describe('controls', () => {
  it('renders the percentage as an inert readout, not a control', () => {
    mount();

    expect(getPercentage().textContent).toBe('100%');
    expect(getPercentage().getAttribute('role')).toBeNull();
    expect(getPercentage().getAttribute('tabindex')).toBeNull();
    expect(getToolbarButtons().some((node) => (node.textContent ?? '').endsWith('%'))).toBe(false);
  });

  it('renders the toolbarAddon alongside the built-in controls', () => {
    mount(
      { height: 300, width: 400 },
      { toolbarAddon: <button data-testid="addon">Addon</button> },
    );

    expect(getToolbar().querySelector('[data-testid="addon"]')).not.toBeNull();
  });

  it('disables zoom out at scale 1', () => {
    mount();
    const zoomOutButton = toolbarButton('zoom-out');

    expect(zoomOutButton.getAttribute('tabindex')).toBe('-1');
    fireEvent.click(zoomOutButton);
    expect(readTransform().scale).toBe(1);
  });

  it('disables zoom in at maxScale', () => {
    mount();
    const zoomInButton = () => toolbarButton('zoom-in');

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

  it('tracks the zoom level in the percentage readout', () => {
    mount();
    const zoomInButton = () => toolbarButton('zoom-in');

    expect(getPercentage().textContent).toBe('100%');

    fireEvent.click(zoomInButton());
    flushAnimations();
    fireEvent.click(zoomInButton());
    flushAnimations();

    expect(getPercentage().textContent).toBe('225%');
    expect(readTransform().scale).toBe(2.25);
  });

  it('does not change the transform when the percentage readout is clicked', () => {
    mount();

    fireEvent.click(toolbarButton('zoom-in'));
    flushAnimations();
    expect(readTransform().scale).toBe(1.5);

    fireEvent.click(getPercentage());
    flushAnimations();

    expect(readTransform().scale).toBe(1.5);
  });

  it('toggles between the fitted size and 100%', () => {
    // 4000 wide against a 1024 viewport minus margins fits to 976, so actual
    // size is a little over 4x and the two states are distinguishable.
    mount({ height: 2000, width: 4000 });

    expect(readTransform().scale).toBe(1);
    expect(getActualSizeToggle().getAttribute('data-actual-size')).toBe('actual');

    fireEvent.click(getActualSizeToggle());
    flushAnimations();
    expect(readTransform().scale).toBeCloseTo(4000 / 976, 5);
    expect(getActualSizeToggle().getAttribute('data-actual-size')).toBe('fit');

    fireEvent.click(getActualSizeToggle());
    flushAnimations();
    expect(readTransform().scale).toBe(1);
    expect(getActualSizeToggle().getAttribute('data-actual-size')).toBe('actual');
  });

  it('disables the actual-size toggle when the image already fits at 100%', () => {
    mount({ height: 300, width: 400 });

    expect(getActualSizeToggle().getAttribute('tabindex')).toBe('-1');
    expect(getActualSizeToggle().getAttribute('data-actual-size')).toBe('actual');
  });

  it('re-fits the layout box to the swapped aspect when rotated from the more menu', () => {
    mount({ height: 2000, width: 4000 });
    const image = getViewerImage() as HTMLImageElement;

    expect(image.style.width).toBe('976px');
    expect(image.style.height).toBe('488px');

    const items = openMoreMenu();
    fireEvent.click(items[3]);

    // The fitted box is 360x720; the element is sized pre-rotation, so it
    // carries the transpose and lands back on 360x720 once rotate(90deg) runs.
    expect(image.style.width).toBe('720px');
    expect(image.style.height).toBe('360px');
    expect(image.style.left).toBe('152px');
    expect(image.style.top).toBe('204px');
  });

  it('keeps the rotated layout box centered on the fitted box', () => {
    mount({ height: 2000, width: 4000 });
    const image = getViewerImage() as HTMLImageElement;

    const items = openMoreMenu();
    fireEvent.click(items[3]);

    const centerX = Number.parseFloat(image.style.left) + Number.parseFloat(image.style.width) / 2;
    const centerY = Number.parseFloat(image.style.top) + Number.parseFloat(image.style.height) / 2;

    expect(centerX).toBe(512);
    expect(centerY).toBe(384);
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

    fireEvent.click(toolbarButton('download'));

    await waitFor(() =>
      expect(toastMock.success).toHaveBeenCalledWith(imageMessages['image.downloadSuccess']),
    );
  });

  it('uses a downstream onDownload handler instead of the default', async () => {
    const onDownload = vi.fn().mockResolvedValue(undefined);
    mount(undefined, { onDownload });

    fireEvent.click(toolbarButton('download'));

    await waitFor(() => expect(onDownload).toHaveBeenCalledWith('https://example.com/cat.png'));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('opens the source in a new tab when the blob download is blocked', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    vi.mocked(fetch).mockRejectedValue(new Error('network error'));
    mount();

    fireEvent.click(toolbarButton('download'));

    await waitFor(() =>
      expect(openSpy).toHaveBeenCalledWith(
        'https://example.com/cat.png',
        '_blank',
        'noopener,noreferrer',
      ),
    );
    expect(toastMock.error).not.toHaveBeenCalledWith(imageMessages['image.downloadFailed']);
    openSpy.mockRestore();
  });
});
