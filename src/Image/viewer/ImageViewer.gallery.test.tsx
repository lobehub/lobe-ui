import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import ImageComponent from '../Image';
import PreviewGroup from '../PreviewGroup';

vi.mock('@/styles/css', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/styles/css')>();
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

const getViewerImage = () => document.querySelector<HTMLImageElement>('.lobe-image-viewer-image');
const getPopup = () => document.querySelector<HTMLElement>('.lobe-image-viewer-popup');
const getCounter = () => document.querySelector<HTMLElement>('.lobe-image-viewer-counter');
const getPrevButton = () => document.querySelector<HTMLElement>('.lobe-image-viewer-nav-prev');
const getNextButton = () => document.querySelector<HTMLElement>('.lobe-image-viewer-nav-next');

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

  it('navigates with ArrowLeft/ArrowRight immediately, including across different image sizes', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b', { height: 600, width: 300 });

    clickThumbnail('a');
    settle();

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('1 / 2');
    fireEvent.keyDown(getPopup() as HTMLElement, { ctrlKey: true, key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('1 / 2');
    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowLeft' });
    expect(getCounter()?.textContent).toBe('1 / 2');

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('2 / 2');
    expect(document.querySelector('[data-ghost]')).toBeNull();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/b.png');
    expect(getViewerImage()?.style.transform).toBe(
      'translate3d(0px, 0px, 0) scale(1) rotate(0deg) scaleX(1) scaleY(1)',
    );
    expect(getViewerImage()?.style.width).toBe('300px');
    expect(motionMock.pending.filter(({ stopped }) => !stopped)).toHaveLength(0);

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('2 / 2');
    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowLeft' });
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/a.png');
  });

  it('removes a running mouse slide immediately when a keyboard switch takes over', () => {
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

    fireEvent.click(getNextButton() as HTMLElement);
    expect(document.querySelectorAll('[data-ghost]')).toHaveLength(1);

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('3 / 3');
    expect(document.querySelector('[data-ghost]')).toBeNull();
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/c.png');
    expect(motionMock.pending.filter(({ stopped }) => !stopped)).toHaveLength(0);
  });

  it('keeps the current image while the More menu handles arrow keys', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
        <ImageComponent alt="c" src="https://example.com/c.png" />
      </PreviewGroup>,
    );
    for (const alt of ['a', 'b', 'c']) stubThumbnail(alt);

    clickThumbnail('b');
    settle();

    const popup = getPopup() as HTMLElement;
    const trigger = popup.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const item = screen.getAllByRole('menuitem')[0];
    expect(popup.contains(item)).toBe(true);

    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('2 / 3');
    fireEvent.keyDown(item, { key: 'ArrowRight' });
    expect(getCounter()?.textContent).toBe('2 / 3');
    fireEvent.keyDown(item, { key: 'ArrowLeft' });
    expect(getCounter()?.textContent).toBe('2 / 3');
  });

  it.each([
    ['ArrowLeft', '2 / 4', 'b'],
    ['ArrowRight', '4 / 4', 'd'],
  ])('handles %s immediately during a reduced-motion pointer fade', (key, count, alt) => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent alt="b" src="https://example.com/b.png" />
        <ImageComponent alt="c" src="https://example.com/c.png" />
        <ImageComponent alt="d" src="https://example.com/d.png" />
      </PreviewGroup>,
    );
    for (const alt of ['a', 'b', 'c', 'd']) stubThumbnail(alt);

    clickThumbnail('b');
    settle();

    fireEvent.click(getNextButton() as HTMLElement);
    expect(getCounter()?.textContent).toBe('2 / 4');

    fireEvent.keyDown(getPopup() as HTMLElement, { key });
    expect(getCounter()?.textContent).toBe(count);
    expect(getViewerImage()?.alt).toBe(alt);
    expect(motionMock.pending.filter(({ stopped }) => !stopped)).toHaveLength(0);

    settle();
    expect(getCounter()?.textContent).toBe(count);
  });

  it('fits a keyboard-selected image on its first load and animates a later preview upgrade', () => {
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src="https://example.com/a.png" />
        <ImageComponent
          alt="b"
          preview={{ src: 'https://example.com/b-hd.png' }}
          src="https://example.com/b.png"
        />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b', { height: 0, width: 0 });

    clickThumbnail('a');
    settle();

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
    const image = getViewerImage() as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('https://example.com/b.png');

    stubNatural(image, 1200, 675);
    fireEvent.load(image);
    expect(image.style.width).toBe('976px');
    expect(motionMock.pending.filter(({ stopped }) => !stopped)).toHaveLength(0);

    FakePreloader.instances[0].emit('load');
    expect(image.getAttribute('src')).toBe('https://example.com/b-hd.png');
    stubNatural(image, 900, 1200);
    fireEvent.load(image);
    expect(motionMock.pending.some(({ stopped }) => !stopped)).toBe(true);
  });

  it('animates a preview upgrade after selecting an already loaded shared thumbnail', () => {
    const thumbnail = 'https://example.com/shared.png';
    renderWithMotion(
      <PreviewGroup>
        <ImageComponent alt="a" src={thumbnail} />
        <ImageComponent alt="b" preview={{ src: 'https://example.com/b-hd.png' }} src={thumbnail} />
      </PreviewGroup>,
    );
    stubThumbnail('a');
    stubThumbnail('b');

    clickThumbnail('a');
    settle();

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
    const image = getViewerImage() as HTMLImageElement;
    expect(image.alt).toBe('b');
    expect(image.getAttribute('src')).toBe(thumbnail);

    // The same loaded src is reused, so the first new load is the upgrade.
    FakePreloader.instances[0].emit('load');
    expect(image.getAttribute('src')).toBe('https://example.com/b-hd.png');
    stubNatural(image, 900, 1200);
    fireEvent.load(image);
    expect(motionMock.pending.some(({ stopped }) => !stopped)).toBe(true);
  });

  it('slides the switch: outgoing ghost exits while the incoming image pushes in from the side', () => {
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

    fireEvent.click(getNextButton() as HTMLElement);

    const ghost = document.querySelector<HTMLImageElement>('[data-ghost]');
    expect(ghost).not.toBeNull();
    expect(ghost?.getAttribute('src')).toBe('https://example.com/a.png');
    expect(ghost?.getAttribute('aria-hidden')).toBe('true');

    const live = document.querySelector<HTMLImageElement>(
      '.lobe-image-viewer-image:not([data-ghost])',
    );
    expect(live?.getAttribute('src')).toBe('https://example.com/b.png');
    expect(live?.style.transform).toContain('translate3d(1024px, 0px, 0)');

    settle();
    expect(document.querySelector('[data-ghost]')).toBeNull();
    const settled = getViewerImage();
    expect(settled?.getAttribute('src')).toBe('https://example.com/b.png');
    expect(settled?.style.transform).toContain('translate3d(0px, 0px, 0)');
  });

  it('rapid switches keep a single ghost and land on the final image', () => {
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

    fireEvent.click(getNextButton() as HTMLElement);
    fireEvent.click(getNextButton() as HTMLElement);

    expect(document.querySelectorAll('[data-ghost]')).toHaveLength(1);

    settle();
    expect(document.querySelectorAll('[data-ghost]')).toHaveLength(0);
    expect(getCounter()?.textContent).toBe('3 / 3');
    expect(getViewerImage()?.getAttribute('src')).toBe('https://example.com/c.png');
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

    fireEvent.keyDown(getPopup() as HTMLElement, { key: 'ArrowRight' });
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
