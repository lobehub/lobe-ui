import { cleanup, render, screen } from '@testing-library/react';

import Input from '../Input';
import TextArea from '../TextArea';

describe('Input / TextArea variant="a2ui"', () => {
  afterEach(cleanup);

  test('Input renders a labelled a2ui field', () => {
    const { container } = render(
      <Input label="Work email" placeholder="name@company.com" variant="a2ui" />,
    );
    const input = screen.getByLabelText('Work email') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input.placeholder).toBe('name@company.com');
    expect(container.querySelector('.lobe-input')?.getAttribute('data-variant')).toBe('a2ui');
  });

  test('TextArea renders three rows by default under its label', () => {
    render(<TextArea label="Feedback" variant="a2ui" />);
    const textarea = screen.getByLabelText('Feedback') as HTMLTextAreaElement;
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.rows).toBe(3);
  });

  test('label is ignored by the other variants', () => {
    render(<Input label="Hidden" variant="outlined" />);
    expect(screen.queryByText('Hidden')).toBeNull();
  });
});
