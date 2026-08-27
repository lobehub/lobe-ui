import { fireEvent, render, screen } from '@testing-library/react';

import Accordion from '../Accordion';

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
});
