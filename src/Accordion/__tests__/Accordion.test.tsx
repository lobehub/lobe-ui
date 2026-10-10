import { fireEvent, render, screen } from '@testing-library/react';

import Accordion from '../Accordion';
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from '../atoms';

const items = [
  { children: 'Panel A', key: 'a', title: 'Item A' },
  { children: 'Panel B', key: 'b', title: 'Item B' },
];

describe('Accordion', () => {
  test('expands defaultValue items and toggles on click', () => {
    render(<Accordion defaultValue={['a']} items={items} />);

    expect(screen.getByText('Panel A')).toBeTruthy();
    expect(screen.queryByText('Panel B')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Item B' }));
    expect(screen.getByText('Panel B')).toBeTruthy();
    expect(screen.getByText('Panel A')).toBeTruthy();
  });

  test('multiple=false keeps a single item open', () => {
    render(<Accordion defaultValue={['a']} items={items} multiple={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'Item B' }));
    expect(screen.getByText('Panel B')).toBeTruthy();
    expect(screen.queryByText('Panel A')).toBeNull();
  });

  test('controlled value reports changes without self-updating', () => {
    const onValueChange = vi.fn();
    render(<Accordion items={items} value={['a']} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Item B' }));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
    expect(screen.queryByText('Panel B')).toBeNull();
  });

  test('disabled item does not toggle', () => {
    render(
      <Accordion items={[{ children: 'Panel C', disabled: true, key: 'c', title: 'Item C' }]} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Item C' }));
    expect(screen.queryByText('Panel C')).toBeNull();
  });

  test('inline placement renders the indicator after the title without panel indent', () => {
    render(<Accordion defaultValue={['a']} indicatorPlacement="inline" items={items} />);

    const trigger = screen.getByRole('button', { name: 'Item A' });
    expect(trigger.lastElementChild?.querySelector('svg')).toBeTruthy();
    expect(trigger.firstChild?.textContent).toBe('Item A');
    const content = screen.getByText('Panel A');
    expect(getComputedStyle(content).paddingInlineStart).not.toBe('24px');
  });

  test('default-open panel skips the enter animation', () => {
    render(<Accordion defaultValue={['a']} items={items} />);

    const openPanel = screen.getByText('Panel A').parentElement;
    expect(openPanel?.style.animationName).toBe('none');
    expect(getComputedStyle(screen.getByText('Panel A')).opacity).not.toBe('0');
  });

  test('opening a closed panel does not keep enter animation suppressed', () => {
    render(<Accordion defaultValue={['a']} items={items} />);

    fireEvent.click(screen.getByRole('button', { name: 'Item B' }));
    const openedPanel = screen.getByText('Panel B').parentElement;
    expect(openedPanel?.style.animationName).not.toBe('none');
  });

  test('AccordionRoot keeps several items open by default', () => {
    render(
      <AccordionRoot defaultValue={['a']}>
        {items.map((item) => (
          <AccordionItem key={item.key} value={item.key}>
            <AccordionHeader>
              <AccordionTrigger>{item.title}</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>{item.children}</AccordionPanel>
          </AccordionItem>
        ))}
      </AccordionRoot>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Item B' }));
    expect(screen.getByText('Panel A')).toBeTruthy();
    expect(screen.getByText('Panel B')).toBeTruthy();
  });
});
