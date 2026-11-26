import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Accordion from '../Accordion';

const items = [
  { children: 'A declarative protocol.', key: 'what', title: 'What is A2UI?' },
  { children: 'Yes.', key: 'stream', title: 'Does it stream?' },
];

describe('Accordion a2ui variant', () => {
  it('renders items on one card with down and up chevrons', () => {
    const { container } = render(
      <Accordion defaultValue={['what']} items={items} multiple={false} variant="a2ui" />,
    );

    expect(container.querySelector('[data-variant="a2ui"]')).toBeTruthy();
    expect(screen.getByText('What is A2UI?')).toBeTruthy();
    expect(screen.getByText('A declarative protocol.')).toBeTruthy();
    // Each trigger carries both chevrons; CSS shows the one matching its state.
    const trigger = screen.getByRole('button', { name: 'What is A2UI?' });
    expect(trigger.querySelectorAll('svg')).toHaveLength(2);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
