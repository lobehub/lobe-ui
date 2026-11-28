import { cleanup, render, screen } from '@testing-library/react';

import Popover from '../Popover';
import PopoverGroup from '../PopoverGroup';

describe('Popover variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders the A2UI panel with the trigger font size', async () => {
    render(
      <Popover open content="Anyone who signed in." variant="a2ui">
        <button style={{ fontSize: 16 }} type="button">
          What counts?
        </button>
      </Popover>,
    );
    const viewport = (await screen.findByText('Anyone who signed in.')).closest(
      '.lobe-popover-viewport',
    ) as HTMLElement;
    const popup = viewport.parentElement as HTMLElement;
    expect(popup.dataset.variant).toBe('a2ui');
    expect(popup.style.getPropertyValue('--lobe-a2ui-popover-font-size')).toBe('16px');
    expect(getComputedStyle(viewport).display).toBe('flex');
  });

  test('stays standalone inside a PopoverGroup; the default variant is unchanged', async () => {
    render(
      <PopoverGroup>
        <Popover open content="A2UI" variant="a2ui">
          <button type="button">One</button>
        </Popover>
        <Popover open content="Plain">
          <button type="button">Two</button>
        </Popover>
      </PopoverGroup>,
    );
    const a2ui = (await screen.findByText('A2UI')).closest('.lobe-popover-viewport')!;
    expect((a2ui.parentElement as HTMLElement).dataset.variant).toBe('a2ui');
    const plain = (await screen.findByText('Plain')).closest('.lobe-popover-viewport')!;
    expect((plain.parentElement as HTMLElement).dataset.variant).toBeUndefined();
  });
});
