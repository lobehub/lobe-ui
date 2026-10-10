import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

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

const TableEditor = ({ initial, item }: { initial: Values['env']; item?: unknown }) => {
  form = useForm<Values>({ initialValues: { env: initial } });
  return (
    <MotionProvider motion={motion}>
      <Form form={form}>
        <FormList
          addText="add row"
          columns={[{ children: <input />, name: 'key', title: 'Key' }]}
          emptyText="nothing here"
          name="env"
          newItem={item}
        />
      </Form>
    </MotionProvider>
  );
};

describe('Form.List columns', () => {
  it('binds each cell, labels it by column title and removes rows', () => {
    render(<TableEditor initial={[{ key: 'A' }, { key: 'B' }]} />);
    expect(screen.getByText('Key')).toBeTruthy();
    const second = screen.getByLabelText('Key 2') as HTMLInputElement;
    expect(second.value).toBe('B');
    fireEvent.change(second, { target: { value: 'BB' } });
    expect(form.getValues().env).toEqual([{ key: 'A' }, { key: 'BB' }]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    expect(form.getValues().env).toEqual([{ key: 'BB' }]);
  });

  it('appends a fresh copy of newItem each time', () => {
    const item = { key: '' };
    render(<TableEditor initial={[]} item={item} />);
    expect(screen.getByText('nothing here')).toBeTruthy();
    fireEvent.click(screen.getByText('add row'));
    fireEvent.click(screen.getByText('add row'));
    fireEvent.change(screen.getByLabelText('Key 1'), { target: { value: 'X' } });
    expect(form.getValues().env).toEqual([{ key: 'X' }, { key: '' }]);
    expect(item).toEqual({ key: '' });
  });
});
