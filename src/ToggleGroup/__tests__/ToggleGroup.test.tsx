import { fireEvent, render, screen } from '@testing-library/react';

import ToggleGroup from '../ToggleGroup';

const options = [
  { label: 'Preview', value: 'preview' },
  { label: 'Source', value: 'source' },
];

describe('ToggleGroup', () => {
  test('selects on click and reports change', () => {
    const onChange = vi.fn();
    render(<ToggleGroup defaultValue="preview" options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Source' }));
    expect(onChange).toHaveBeenCalledWith('source');
    expect(screen.getByRole('button', { name: 'Source' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  test('clicking the pressed item does not deselect', () => {
    const onChange = vi.fn();
    render(<ToggleGroup defaultValue="preview" options={options} onChange={onChange} />);

    const preview = screen.getByRole('button', { name: 'Preview' });
    fireEvent.click(preview);
    expect(preview.getAttribute('aria-pressed')).toBe('true');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('disabled option cannot be selected', () => {
    render(
      <ToggleGroup
        defaultValue="a"
        options={[
          { label: 'A', value: 'a' },
          { disabled: true, label: 'B', value: 'b' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'B' }).getAttribute('aria-pressed')).toBe('false');
  });

  test('multiple: toggles items independently and reports an array', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup multiple defaultValue={['preview']} options={options} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Source' }));

    expect(onChange).toHaveBeenLastCalledWith(['preview', 'source']);
    expect(screen.getByRole('button', { name: 'Preview' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'Source' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  test('multiple: clicking a pressed item deselects it', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup
        multiple
        defaultValue={['preview', 'source']}
        options={options}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Source' }));

    expect(onChange).toHaveBeenLastCalledWith(['preview']);
    expect(screen.getByRole('button', { name: 'Source' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  test('multiple: can clear the last pressed item', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup multiple defaultValue={['preview']} options={options} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('button', { name: 'Preview' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  test('multiple: defaults to the segmented variant', () => {
    render(<ToggleGroup multiple defaultValue={['preview']} options={options} />);

    expect(screen.getByRole('group').getAttribute('data-variant')).toBe('segmented');
  });
});
