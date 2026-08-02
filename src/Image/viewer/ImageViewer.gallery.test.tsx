import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import ImageComponent from '../Image';
import PreviewGroup from '../PreviewGroup';

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

const flushAnimations = () =>
  act(() => {
    const tasks = motionMock.pending.splice(0);
    for (const task of tasks) if (!task.stopped) task.run();
  });

const settle = () => {
  flushAnimations();
  flushAnimations();
};

class FakePreloader {
  static instances: FakePreloader[] = [];
  private handlers = new Map<string, Set<() => void>>();
  src = '';

  constructor() {
    FakePreloader.instances.push(this);
  }

  addEventListener(type: string, handler: () => void) {
    const set = this.handlers.get(type) ?? new Set();
    set.add(handler);
    this.handlers.set(type, set);
  }

  removeEventListener(type: string, handler: () => void) {
    this.handlers.get(type)?.delete(handler);
  }

  emit(type: string) {
    act(() => {
      for (const handler of this.handlers.get(type) ?? []) handler();
    });
  }
}

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

const stubNatural = (element: HTMLImageElement, width: number, height: number) => {
  Object.defineProperty(element, 'naturalWidth', { configurable: true, value: width });
  Object.defineProperty(element, 'naturalHeight', { configurable: true, value: height });
};

const renderWithMotion = (node: ReactNode) =>
  render(<ConfigProvider motion={motion}>{node}</ConfigProvider>);

const getViewerImage = () => document.querySelector<HTMLImageElement>('.viewerImage');
const getPopup = () => document.querySelector<HTMLElement>('.viewerPopup');
const getCounter = () => document.querySelector<HTMLElement>('.viewerCounter');
const getPrevButton = () => document.querySelector<HTMLElement>('.viewerNavPrev');
const getNextButton = () => document.querySelector<HTMLElement>('.viewerNavNext');

const wheel = (init: { ctrlKey?: boolean; deltaY: number }) =>
  act(() => {
    getPopup()?.dispatchEvent(
      new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        clientX: 512,
        clientY: 384,
        ...init,
      }),
    );
  });

const stubThumbnail = (
  alt: string,
  natural = { height: 300, width: 400 },
  rect: Partial<DOMRect> = THUMB_RECT,
) => {
  const element = screen.getByAltText(alt) as HTMLImageElement;
  stubNatural(element, natural.width, natural.height);
  stubRect(element, rect);
  return element;
};

const clickThumbnail = (alt: string) => fireEvent.click(screen.getByAltText(alt));

const dismissViaImage = () => {
  fireEvent.click(getViewerImage() as HTMLElement);
  act(() => {
    vi.advanceTimersByTime(300);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  motionMock.pending.length = 0;
  FakePreloader.instances.length = 0;
  setViewport(VIEWPORT);
  vi.stubGlobal('Image', FakePreloader);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('gallery navigation', () => {
  it('opens at the clicked index and shows a counter pill', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
        <ImageComponent alt="c" src="https://example.com/c.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');
    stubThumbnail('c');

    clickThumbnail('b');
    settle();

    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');
    expect(getCounter()?.textContent).toBe('2 / 3');
  });

  it('hides the prev/next buttons and counter for a standalone image', () => {
    renderWithMotion(<ImageComponent alt="cat" src="https://example.com/cat.png" />);
    stubThumbnail('cat');
    clickThumbnail('cat');
    settle();

    expect(getCounter()).toBeNull();
    expect(getPrevButton()).toBeNull();
    expect(getNextButton()).toBeNull();
  });

  it('hides the prev/next buttons and counter for a single-entry group', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="only" src="https://example.com/only.png" />
      </PreviewGroup>,
    );
    stubThumbnail('only');
    clickThumbnail('only');
    settle();

    expect(getCounter()).toBeNull();
    expect(getPrevButton()).toBeNull();
    expect(getNextButton()).toBeNull();
  });

  it('navigates with the next/prev buttons and stops at the ends without wrapping', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
        <ImageComponent alt="c" src="https://example.com/c.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');
    stubThumbnail('c');

    clickThumbnail('a');
    settle();

    expect(getPrevButton()).toBeNull();
    expect(getNextButton()).not.toBeNull();

    fireEvent.click(getNextButton() as HTMLElement);
    settle();
    expect(getCounter()?.textContent).toBe('2 / 3');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');
    expect(getPrevButton()).not.toBeNull();
    expect(getNextButton()).not.toBeNull();

    fireEvent.click(getNextButton() as HTMLElement);
    settle();
    expect(getCounter()?.textContent).toBe('3 / 3');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/c.png');
    expect(getNextButton()).toBeNull();

    fireEvent.click(getPrevButton() as HTMLElement);
    settle();
    expect(getCounter()?.textContent).toBe('2 / 3');
  });

  it('navigates with ArrowLeft/ArrowRight and stops at the ends', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    settle();
    expect(getCounter()?.textContent).toBe('1 / 2');

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    settle();
    expect(getCounter()?.textContent).toBe('2 / 2');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    settle();
    expect(getCounter()?.textContent).toBe('2 / 2');
  });

  it('resets transform and recomputes fit from the new image on switch', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a', { height: 300, width: 400 });
    stubThumbnail('b', { height: 600, width: 800 });

    clickThumbnail('a');
    settle();

    const image = getViewerImage() as HTMLImageElement;
    expect(image.style.width).toBe('400px');
    expect(image.style.height).toBe('300px');

    wheel({ ctrlKey: true, deltaY: -100 });
    expect(image.style.transform).not.toBe(
      'translate3d(0px, 0px, 0) scale(1) rotate(0deg) scaleX(1) scaleY(1)',
    );

    fireEvent.click(getNextButton() as HTMLElement);
    settle();

    expect(image.style.transform).toBe(
      'translate3d(0px, 0px, 0) scale(1) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(image.style.width).toBe('800px');
    expect(image.style.height).toBe('600px');
    expect(image.style.left).toBe('112px');
    expect(image.style.top).toBe('84px');
  });

  it('preloads the dual source per image on switch', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent
          alt="a"
          preview={{ src: 'https://example.com/a-hd.png' }}
          src="https://example.com/a.png"
        />
        <ImageComponent
          alt="b"
          preview={{ src: 'https://example.com/b-hd.png' }}
          src="https://example.com/b.png"
        />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();
    expect(FakePreloader.instances).toHaveLength(1);
    expect(FakePreloader.instances[0].src).toBe('https://example.com/a-hd.png');

    fireEvent.click(getNextButton() as HTMLElement);
    settle();

    expect(FakePreloader.instances).toHaveLength(2);
    expect(FakePreloader.instances[1].src).toBe('https://example.com/b-hd.png');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');

    FakePreloader.instances[1].emit('load');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b-hd.png');
  });

  it('overrides per-image toolbar addon across a switch', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent
          alt="a"
          preview={{ toolbarAddon: <span>AddonA</span> }}
          src="https://example.com/a.png"
        />
        <ImageComponent
          alt="b"
          preview={{ toolbarAddon: <span>AddonB</span> }}
          src="https://example.com/b.png"
        />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();
    expect(screen.getByText('AddonA')).toBeDefined();
    expect(screen.queryByText('AddonB')).toBeNull();

    fireEvent.click(getNextButton() as HTMLElement);
    settle();
    expect(screen.queryByText('AddonA')).toBeNull();
    expect(screen.getByText('AddonB')).toBeDefined();
  });

  it('flips to the currently displayed entry on close after navigating', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    const thumbB = stubThumbnail('b');

    clickThumbnail('a');
    settle();

    fireEvent.click(getNextButton() as HTMLElement);
    settle();

    stubRect(thumbB, { height: 150, left: 500, top: 100, width: 200 });
    const image = getViewerImage() as HTMLImageElement;
    dismissViaImage();
    settle();

    expect(image.style.transform).toBe(
      'translate3d(88px, -209px, 0) scale(0.5) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('fires onOpenChange once for open and once for close regardless of navigation', () => {
    const onOpenChange = vi.fn();
    renderWithMotion(
      <PreviewGroup preview={{ onOpenChange }}>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
        <ImageComponent alt="c" src="https://example.com/c.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');
    stubThumbnail('c');

    clickThumbnail('b');
    settle();
    expect(onOpenChange.mock.calls).toEqual([[true]]);

    fireEvent.click(getNextButton() as HTMLElement);
    settle();
    fireEvent.click(getPrevButton() as HTMLElement);
    settle();
    fireEvent.click(getPrevButton() as HTMLElement);
    settle();
    expect(onOpenChange.mock.calls).toEqual([[true]]);

    dismissViaImage();
    settle();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('cancels a pending click-to-close timer when the user switches via keyboard before it fires', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();

    fireEvent.click(getViewerImage() as HTMLElement);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    settle();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    settle();

    expect(screen.queryByRole('dialog')).not.toBeNull();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');
  });

  it('resets the wheel-close accumulator on switch instead of carrying it over', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();

    wheel({ deltaY: 80 });
    settle();
    expect(screen.queryByRole('dialog')).not.toBeNull();

    fireEvent.click(getNextButton() as HTMLElement);
    settle();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');

    wheel({ deltaY: 30 });
    settle();
    expect(screen.queryByRole('dialog')).not.toBeNull();

    wheel({ deltaY: 100 });
    settle();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
