import { act, fireEvent, render, screen } from '@testing-library/react';

import FormField from './Field';
import Form from './Form';
import FormList from './List';
import { stubMatchMedia } from './test-utils';
import type { FormInstance } from './type';
import { useForm } from './useForm';

stubMatchMedia();

type Values = { env: { key: string }[] };

let form!: FormInstance<Values>;

const Editor = ({ initial }: { initial: Values['env'] }) => {
  form = useForm<Values>({ initialValues: { env: initial } });
  return (
    <Form form={form}>
      <FormList name="env">
        {({ fields, add, remove, move }) => (
          <>
            {fields.map((field) => (
              <div data-testid="row" key={field.key}>
                <FormField bare name={`${field.name}.key` as never}>
                  <input aria-label={`key-${field.index}`} />
                </FormField>
                <button type="button" onClick={() => remove(field.index)}>
                  {`remove-${field.index}`}
                </button>
              </div>
            ))}
            <button type="button" onClick={() => add({ key: 'NEW' })}>
              add
            </button>
            <button type="button" onClick={() => move(0, fields.length - 1)}>
              rotate
            </button>
          </>
        )}
      </FormList>
    </Form>
  );
};

describe('Form.List', () => {
  it('renders a row per item bound by index path and appends with add', () => {
    render(<Editor initial={[{ key: 'A' }, { key: 'B' }]} />);
    expect(screen.getAllByTestId('row')).toHaveLength(2);
    expect((screen.getByLabelText('key-1') as HTMLInputElement).value).toBe('B');
    fireEvent.click(screen.getByText('add'));
    expect(screen.getAllByTestId('row')).toHaveLength(3);
    expect((screen.getByLabelText('key-2') as HTMLInputElement).value).toBe('NEW');
    expect(form.getValues().env).toEqual([{ key: 'A' }, { key: 'B' }, { key: 'NEW' }]);
  });

  it('removing a middle row keeps the following rows mounted', () => {
    render(<Editor initial={[{ key: 'A' }, { key: 'B' }, { key: 'C' }]} />);
    const third = screen.getAllByTestId('row')[2];
    fireEvent.click(screen.getByText('remove-1'));
    const rows = screen.getAllByTestId('row');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toBe(third);
    expect((screen.getByLabelText('key-1') as HTMLInputElement).value).toBe('C');
    expect(form.getValues().env).toEqual([{ key: 'A' }, { key: 'C' }]);
  });

  it('move reorders values', () => {
    render(<Editor initial={[{ key: 'A' }, { key: 'B' }, { key: 'C' }]} />);
    fireEvent.click(screen.getByText('rotate'));
    expect(form.getValues().env).toEqual([{ key: 'B' }, { key: 'C' }, { key: 'A' }]);
  });

  it('follows external length changes from reset', () => {
    render(<Editor initial={[{ key: 'A' }]} />);
    act(() => form.reset({ env: [{ key: 'X' }, { key: 'Y' }] }));
    expect(screen.getAllByTestId('row')).toHaveLength(2);
    expect((screen.getByLabelText('key-1') as HTMLInputElement).value).toBe('Y');
  });
});
