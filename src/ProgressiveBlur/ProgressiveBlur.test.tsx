import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProgressiveBlur from './ProgressiveBlur';
import { progressiveBlurClasses } from './stable';
import { getBlurLayers } from './utils';

const layerSelector = `.${progressiveBlurClasses('layer')}`;
const gradientSelector = `.${progressiveBlurClasses('gradient')}`;

describe('ProgressiveBlur', () => {
  it('renders three blur layers and a gradient by default', () => {
    const { container } = render(<ProgressiveBlur />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.classList.contains(progressiveBlurClasses.block)).toBe(true);
    expect(root.dataset.position).toBe('bottom');
    expect(root.dataset.mode).toBe('auto');
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll(layerSelector)).toHaveLength(3);
    expect(container.querySelectorAll(gradientSelector)).toHaveLength(1);
  });

  it('renders the requested number of layers with a doubling blur', () => {
    const { container } = render(<ProgressiveBlur layers={4} maxBlur={8} />);
    const layers = [...container.querySelectorAll<HTMLElement>(layerSelector)];

    expect(layers).toHaveLength(4);
    expect(
      layers.map((layer) => layer.style.getPropertyValue('--lobe-progressive-blur-layer-blur')),
    ).toEqual(['1px', '2px', '4px', '8px']);
  });

  it('clamps the blur to 12px and the layer count to 1–8', () => {
    expect(getBlurLayers(2, 40).map((layer) => layer.blur)).toEqual([6, 12]);
    expect(getBlurLayers(0, 12)).toHaveLength(1);
    expect(getBlurLayers(20, 12)).toHaveLength(8);
    expect(getBlurLayers(3, 12).map(({ end, start }) => [start, end])).toEqual([
      [0, 33.333],
      [33.333, 66.667],
      [66.667, 100],
    ]);
  });

  it('renders no blur layers in gradient mode', () => {
    const { container } = render(<ProgressiveBlur mode="gradient" />);

    expect(container.querySelectorAll(layerSelector)).toHaveLength(0);
    expect(container.querySelectorAll(gradientSelector)).toHaveLength(1);
  });

  it('reflects the position and only inlines explicit props', () => {
    const { container, rerender } = render(<ProgressiveBlur position="top" />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.dataset.position).toBe('top');
    expect(root.style.getPropertyValue('--lobe-progressive-blur-height')).toBe('');

    rerender(<ProgressiveBlur gradientOpacity={2} height={80} position="left" />);
    expect(root.dataset.position).toBe('left');
    expect(root.style.getPropertyValue('--lobe-progressive-blur-height')).toBe('80px');
    expect(root.style.getPropertyValue('--lobe-progressive-blur-gradient-opacity')).toBe('1');
  });

  it('wraps children and lays the band over the edge', () => {
    const { container, getByText } = render(
      <ProgressiveBlur classNames={{ edge: 'edge-x' }} position="right">
        <span>Report</span>
      </ProgressiveBlur>,
    );
    const root = container.firstElementChild as HTMLElement;
    const content = root.querySelector(`.${progressiveBlurClasses('content')}`);
    const edge = root.querySelector(`.${progressiveBlurClasses('edge')}`);

    expect(root.getAttribute('aria-hidden')).toBeNull();
    expect(content?.contains(getByText('Report'))).toBe(true);
    expect(edge?.classList.contains('edge-x')).toBe(true);
    expect(edge?.getAttribute('aria-hidden')).toBe('true');
    expect(edge?.querySelectorAll(layerSelector)).toHaveLength(3);
  });
});
