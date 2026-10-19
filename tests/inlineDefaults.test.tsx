import { cleanup, render } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { Checkbox, ColorSwatches, EditableText, ImageSelect, Radio, Rate } from '@/index';
import { MotionProvider } from '@/MotionProvider';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MotionProvider motion={motion}>{children}</MotionProvider>
);

const renderUi = (node: ReactElement) => render(node, { wrapper: Wrapper });

const computed = (selector: string) => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`missing ${selector}`);
  return { inline: element.style, style: getComputedStyle(element) };
};

afterEach(cleanup);

describe('component defaults live in stylesheets, explicit props stay inline', () => {
  it('Checkbox', () => {
    renderUi(<Checkbox />);
    const box = computed('.lobe-checkbox__checkbox');
    expect(box.inline.width).toBe('');
    expect(box.style.width).toBe('16px');
    expect(box.style.borderRadius).toBe('4px');

    cleanup();
    renderUi(<Checkbox size={24} />);
    expect(computed('.lobe-checkbox__checkbox').inline.width).toBe('24px');
  });

  it('Radio', () => {
    renderUi(<Radio value="a" />);
    const dot = computed('.lobe-radio__radio');
    expect(dot.inline.width).toBe('');
    expect(dot.style.width).toBe('16px');

    cleanup();
    renderUi(<Radio size={24} value="a" />);
    expect(computed('.lobe-radio__radio').inline.width).toBe('24px');
  });

  it('Rate', () => {
    renderUi(<Rate />);
    const root = computed('.lobe-rate');
    expect(root.inline.getPropertyValue('--lobe-rate-size')).toBe('');
    expect(computed('.lobe-rate__star').inline.fontSize).toBe('');

    cleanup();
    renderUi(<Rate size={32} />);
    expect(computed('.lobe-rate').inline.getPropertyValue('--lobe-rate-size')).toBe('32px');
  });

  it('ColorSwatches', () => {
    renderUi(<ColorSwatches colors={[{ color: '#f00', title: 'Red' }]} />);
    const item = computed('.lobe-color-swatches__item');
    expect(item.inline.borderRadius).toBe('');
    expect(item.style.borderRadius).toBe('50%');
  });

  it('ImageSelect', () => {
    renderUi(<ImageSelect options={[{ img: 'data:,', label: 'A', value: 'a' }]} />);
    const img = computed('.lobe-image-select__img');
    expect(img.inline.width).toBe('');
    expect(img.style.width).toBe('144px');

    cleanup();
    renderUi(<ImageSelect options={[{ img: 'data:,', label: 'A', value: 'a' }]} width={200} />);
    expect(computed('.lobe-image-select__img').inline.width).toBe('200px');
  });

  it('EditableText', () => {
    renderUi(<EditableText value="Text" />);
    const root = computed('.lobe-editable-text');
    expect(root.inline.height).toBe('');
    expect(root.style.height).toBe('24px');
  });
});
