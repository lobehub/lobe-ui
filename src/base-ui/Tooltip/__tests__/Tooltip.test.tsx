import { render, screen } from '@testing-library/react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  test('styles the popup slots and merges consumer classNames and styles', async () => {
    render(
      <Tooltip
        arrow
        open
        className="popup-class"
        classNames={{ arrow: 'arrow-class', content: 'content-class', root: 'root-class' }}
        placement="left"
        popupContainer={document.body}
        styles={{ arrow: { opacity: 0.5 }, content: { margin: 3 }, root: { color: 'red' } }}
        title="Hint"
      >
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const viewport = (await screen.findByText('Hint')).closest('.lobe-tooltip-viewport')!;
    const popup = viewport.parentElement!;
    const positioner = popup.parentElement!;
    const arrow = popup.querySelector('.arrow-class')!;
    const svg = arrow.querySelector('svg')!;

    expect(viewport.classList.contains('content-class')).toBe(true);
    expect((viewport as HTMLElement).style.margin).toBe('3px');
    expect(popup.classList.contains('popup-class')).toBe(true);
    expect(popup.classList.contains('root-class')).toBe(true);
    expect(popup.style.color).toBe('red');
    expect((arrow as HTMLElement).style.opacity).toBe('0.5');
    expect(positioner.style.zIndex).toBe('114514');

    expect(getComputedStyle(popup).backgroundColor).toBe(cssVar.colorBgElevated);
    expect(getComputedStyle(popup).transitionProperty).toMatch(/^opacity, ?transform$/);
    expect(getComputedStyle(positioner).getPropertyValue('--lobe-tooltip-translate-x')).toBe(
      'var(--lobe-tooltip-animation-translate)',
    );
    expect(getComputedStyle(viewport).paddingInline).toBe(
      'var(--lobe-tooltip-viewport-inline-padding)',
    );
    expect(getComputedStyle(svg).fill).toBe(cssVar.colorBgElevated);
    expect(getComputedStyle(arrow).transform).toBe('rotate(90deg)');
  });
});
