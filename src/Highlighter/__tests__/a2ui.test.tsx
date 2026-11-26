import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { loadEngine } from '../engine';
import Highlighter from '../Highlighter';

describe('Highlighter a2ui variant', () => {
  it('renders the playground frame: file label, copy button and lobe syntax colours', async () => {
    await loadEngine('lobe-theme');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const { container } = render(
      <Highlighter fileName="catalog.ts" language="ts" variant="a2ui">
        {'export const a = 1;'}
      </Highlighter>,
    );

    const figure = container.querySelector('figure');
    expect(figure?.dataset.variant).toBe('a2ui');
    expect(screen.getByText('catalog.ts')).toBeTruthy();

    await waitFor(() =>
      expect(container.querySelector('pre')?.innerHTML).toContain('--lobe-color-info'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('export const a = 1;'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy());
  });
});
