import { cleanup, render as rtlRender } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { MotionProvider } from '@/MotionProvider';

import { EXEMPT, FIXTURES, PENDING, type StableFixture } from './stableClasses.fixtures';

const ENTRIES: Record<string, () => Promise<Record<string, unknown>>> = {
  '': () => import('@/index'),
  'awesome': () => import('@/awesome'),
  'brand': () => import('@/brand'),
  'chat': () => import('@/chat'),
  'color': () => import('@/color'),
  'dashboard': () => import('@/dashboard'),
  'form': () => import('@/FormKit'),
  'mdx': () => import('@/mdx'),
  'mobile': () => import('@/mobile'),
  'pro-table': () => import('@/ProTable'),
};

const collectExportKeys = async () => {
  const keys: string[] = [];
  for (const [namespace, load] of Object.entries(ENTRIES)) {
    const mod = await load();
    for (const name of Object.keys(mod)) {
      if (!/^[A-Z]/.test(name) || (name.length > 1 && /^[\dA-Z_]+$/.test(name))) continue;
      keys.push(namespace ? `${namespace}/${name}` : name);
    }
  }
  return keys.sort();
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);

const render = (node: ReactElement) => rtlRender(node, { wrapper: Wrapper });

const findBlock = (fixture: StableFixture, container: HTMLElement) =>
  fixture.portal || fixture.blockQuery
    ? document.body.querySelector<HTMLElement>(`.${fixture.classes.block}`)
    : (container.firstElementChild as HTMLElement | null);

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    addEventListener: () => {},
    addListener: () => {},
    matches: false,
    media: query,
    removeEventListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver ??= class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

describe('stable class names', () => {
  it('classifies every public export exactly once', async () => {
    const exported = await collectExportKeys();
    const listed = [...Object.keys(FIXTURES), ...Object.keys(EXEMPT), ...PENDING];

    const duplicates = listed.filter((key, index) => listed.indexOf(key) !== index);
    expect(duplicates).toEqual([]);
    expect(exported.filter((key) => !listed.includes(key))).toEqual([]);
    expect(listed.filter((key) => !exported.includes(key))).toEqual([]);
  });

  describe.each(Object.entries(FIXTURES))('%s', (_key, fixture) => {
    it('renders the block class on its root', () => {
      const { container } = render(fixture.render({}));
      expect(findBlock(fixture, container)?.classList.contains(fixture.classes.block)).toBe(true);
    });

    it('renders every declared element', () => {
      render(fixture.render({}));
      const missing = fixture.classes.elements
        .filter((element) => !fixture.conditional?.includes(element))
        .filter((element) => !document.body.querySelector(`.${fixture.classes(element)}`));
      expect(missing).toEqual([]);
    });

    it('keeps the stable class next to a user className', () => {
      const { container } = render(fixture.render({ className: 'user-x' }));
      const block = findBlock(fixture, container);
      expect(block?.classList.contains(fixture.classes.block)).toBe(true);
      const target = fixture.classNameTarget
        ? document.body.querySelector(`.${fixture.classes(fixture.classNameTarget)}`)
        : block;
      expect(target?.classList.contains('user-x')).toBe(true);
    });
  });
});
