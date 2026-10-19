import { cleanup, render } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';

import { BentoCard, BentoGrid, CodeShowcase, FeatureGrid, LogoMarquee } from '@/awesome';
import { Layout, Rate, ScrollShadow } from '@/index';
import { MotionProvider } from '@/MotionProvider';

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

const declared = (node: ReactElement, selector: string, variable: string) => {
  render(<MotionProvider motion={motion}>{node}</MotionProvider>);
  const element = document.querySelector<HTMLElement>(selector)!;
  return getComputedStyle(element).getPropertyValue(variable).trim();
};

describe('CSS variable defaults live on the block, so nested instances do not inherit', () => {
  it.each<[string, ReactElement, string, string, string]>([
    [
      'ScrollShadow',
      <ScrollShadow key="s" />,
      '.lobe-scroll-shadow',
      '--scroll-shadow-size',
      '16%',
    ],
    ['Layout', <Layout key="l" />, '.lobe-layout', '--layout-header-height', '64px'],
    ['Rate size', <Rate key="r" />, '.lobe-rate', '--lobe-rate-size', '20px'],
    [
      'BentoGrid columns',
      <BentoGrid key="b" />,
      '.lobe-awesome-bento-grid',
      '--bento-columns',
      '4',
    ],
    [
      'BentoGrid row height',
      <BentoGrid key="b" />,
      '.lobe-awesome-bento-grid',
      '--bento-row-height',
      '120px',
    ],
    ['BentoCard', <BentoCard key="c" />, '.lobe-awesome-bento-card', '--bento-col-span', '1'],
    [
      'FeatureGrid',
      <FeatureGrid items={[]} key="f" />,
      '.lobe-awesome-feature-grid',
      '--feature-grid-columns',
      '3',
    ],
    [
      'LogoMarquee gap',
      <LogoMarquee items={[]} key="m" />,
      '.lobe-awesome-logo-marquee',
      '--logo-marquee-gap',
      '36px',
    ],
    [
      'CodeShowcase',
      <CodeShowcase items={[{ code: 'a', key: 'a', label: 'A', preview: 'A' }]} key="cs" />,
      '.lobe-awesome-code-showcase',
      '--code-showcase-min-height',
      'auto',
    ],
  ])('%s', (_name, node, selector, variable, value) => {
    expect(declared(node, selector, variable)).toBe(value);
  });

  it('still lets an explicit prop win inline', () => {
    expect(
      declared(<ScrollShadow size={40} />, '.lobe-scroll-shadow', '--scroll-shadow-size'),
    ).toBe('40%');
  });
});
