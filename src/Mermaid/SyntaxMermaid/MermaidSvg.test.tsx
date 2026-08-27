import { fireEvent, render } from '@testing-library/react';

import MermaidSvg from './MermaidSvg';

const openPreview = vi.hoisted(() => vi.fn());

vi.mock('@/Image/viewer/registry', () => ({ openPreview, usePreviewSession: () => null }));

const SVG = '<svg id="scope-1" viewBox="0 0 10 10" style="--bg: rgb(1, 2, 3)"></svg>';

beforeEach(() => {
  openPreview.mockClear();
  vi.stubGlobal('URL', { ...URL, createObjectURL: () => 'blob:mermaid', revokeObjectURL: vi.fn() });
});

afterEach(() => vi.unstubAllGlobals());

describe('MermaidSvg', () => {
  it('opens the in-house viewer anchored on the diagram box', () => {
    const { container } = render(<MermaidSvg svg={SVG} />);

    fireEvent.click(container.querySelector('svg')!.parentElement!);

    expect(openPreview).toHaveBeenCalledTimes(1);
    const entry = openPreview.mock.calls[0][0];
    expect(entry.src).toBe('blob:mermaid');
    expect(entry.element).toBe(container.querySelector('img'));
  });
});
