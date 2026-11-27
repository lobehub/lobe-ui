import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import Input from '@/Input/Input';

import { Form, useForm } from './index';
import { stubMatchMedia } from './test-utils';

beforeAll(stubMatchMedia);

const Demo = ({ onSubmit }: { onSubmit: (values: { email: string }) => void }) => {
  const form = useForm({ initialValues: { email: '' }, onSubmit });
  return (
    <Form aria-label="Newsletter" form={form} variant="a2ui">
      <Form.Field required label="Email" name="email">
        <Input variant="a2ui" />
      </Form.Field>
      <Form.SubmitFooter texts={{ reset: 'Cancel', submit: 'Subscribe' }} />
    </Form>
  );
};

describe('Form variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders label-over-control fields and a pill submit row that submits', async () => {
    const onSubmit = vi.fn();
    const { container } = render(<Demo onSubmit={onSubmit} />);
    const root = container.querySelector('form') as HTMLFormElement;
    expect(root.dataset.variant).toBe('a2ui');
    const input = screen.getByLabelText(/Email/) as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(container.querySelector('.lobe-form-form__field-required')?.textContent).toBe('*');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    fireEvent.change(input, { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ email: 'a@b.co' });
  });
});
