import { cleanup, render, screen } from '@testing-library/react';

import Tooltip from '../Tooltip';
import TooltipGroup from '../TooltipGroup';

describe('Tooltip variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders the inverted panel sized from the text around the trigger', async () => {
    render(
      <div style={{ fontSize: 16 }}>
        <Tooltip open popupContainer={document.body} title="Available in December." variant="a2ui">
          <span style={{ fontSize: 12 }}>Beta</span>
        </Tooltip>
      </div>,
    );

    const viewport = (await screen.findByText('Available in December.')).closest(
      '.lobe-tooltip-viewport',
    ) as HTMLElement;
    const popup = viewport.parentElement!;

    expect(popup.dataset.variant).toBe('a2ui');
    expect(getComputedStyle(popup).backgroundColor).toBe('var(--lobe-color-text)');
    expect(getComputedStyle(popup).color).toBe('var(--lobe-color-bg-layout)');
    expect(popup.style.getPropertyValue('--lobe-a2ui-tooltip-font-size')).toBe('16px');
    expect(getComputedStyle(viewport).maxWidth).toBe('240px');
  });

  test('stays standalone inside a TooltipGroup', async () => {
    render(
      <TooltipGroup>
        <Tooltip open popupContainer={document.body} title="Hint" variant="a2ui">
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipGroup>,
    );
    const viewport = (await screen.findByText('Hint')).closest('.lobe-tooltip-viewport')!;
    expect((viewport.parentElement as HTMLElement).dataset.variant).toBe('a2ui');
  });

  test('the default variant keeps its look', async () => {
    render(
      <Tooltip open popupContainer={document.body} title="Plain">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const viewport = (await screen.findByText('Plain')).closest('.lobe-tooltip-viewport')!;
    const popup = viewport.parentElement as HTMLElement;
    expect(popup.dataset.variant).toBeUndefined();
    expect(getComputedStyle(popup).backgroundColor).toBe('var(--lobe-color-bg-elevated)');
  });
});
