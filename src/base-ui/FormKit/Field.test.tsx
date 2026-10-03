import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { z } from 'zod';

import { Checkbox } from '@/base-ui/Checkbox';
import { Input } from '@/base-ui/Input';

import { FormKitContext } from './context';
import FormField from './Field';
import { getInternals } from './instance';
import { stubMatchMedia } from './test-utils';
import type { FormInstance } from './type';
import { useForm } from './useForm';

stubMatchMedia();

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const setup = <T extends Record<string, any>>(initialValues: T, onValuesChange = vi.fn()) => {
  const { result } = renderHook(() => useForm({ initialValues, onValuesChange }));
  const form = result.current as FormInstance<T>;
  const Wrap = ({ children }: { children: ReactNode }) => (
    <FormKitContext value={{ form, layout: 'vertical', variant: 'borderless' }}>
      {children}
    </FormKitContext>
  );
  return { Wrap, form, onValuesChange };
};

describe('Form.Field binding', () => {
  it('injects value and onChange into a single child and writes user changes', () => {
    const { Wrap, form, onValuesChange } = setup({ title: 'hello' });
    render(
      <Wrap>
        <FormField label="Title" name="title">
          <input />
        </FormField>
      </Wrap>,
    );
    const input = screen.getByLabelText('Title') as HTMLInputElement;
    expect(input.value).toBe('hello');
    fireEvent.change(input, { target: { value: 'world' } });
    expect(form.getValue('title')).toBe('world');
    expect(input.value).toBe('world');
    expect(onValuesChange).toHaveBeenCalledWith({ title: 'world' }, { title: 'world' });
  });

  it('shows a value written after mount into a base-ui Input that started empty', () => {
    const { Wrap, form } = setup<{ key?: string }>({});
    render(
      <Wrap>
        <FormField label="Key" name="key">
          <Input />
        </FormField>
      </Wrap>,
    );
    const input = screen.getByLabelText('Key') as HTMLInputElement;
    expect(input.value).toBe('');
    act(() => form.reset({ key: 'loaded' }));
    expect(input.value).toBe('loaded');
  });

  it('still calls the child own onChange before writing', () => {
    const { Wrap, form } = setup({ title: '' });
    const own = vi.fn(() => expect(form.getValue('title')).toBe(''));
    render(
      <Wrap>
        <FormField label="Title" name="title">
          <input onChange={own} />
        </FormField>
      </Wrap>,
    );
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'x' } });
    expect(own).toHaveBeenCalledTimes(1);
    expect(form.getValue('title')).toBe('x');
  });

  it('binds a native checkbox through checked', () => {
    const { Wrap, form } = setup({ agree: false });
    render(
      <Wrap>
        <FormField label="Agree" name="agree">
          <input type="checkbox" />
        </FormField>
      </Wrap>,
    );
    const box = screen.getByLabelText('Agree') as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    expect(form.getValue('agree')).toBe(true);
  });

  it('uses a control static formBinding (base-ui Checkbox → checked)', () => {
    const { Wrap, form } = setup({ agree: true });
    render(
      <Wrap>
        <FormField label="Agree" name="agree">
          <Checkbox />
        </FormField>
      </Wrap>,
    );
    const box = screen.getByRole('checkbox');
    expect(box.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(box);
    expect(form.getValue('agree')).toBe(false);
  });

  it('valueProp and getValue adapt third-party controls', () => {
    const { Wrap, form } = setup({ color: 'red' });
    const Picker = ({ hue, onPick }: { hue?: string; onPick?: (e: { hex: string }) => void }) => (
      <button type="button" onClick={() => onPick?.({ hex: 'blue' })}>
        {hue}
      </button>
    );
    render(
      <Wrap>
        <FormField
          getValue={(e: { hex: string }) => e.hex}
          label="Color"
          name="color"
          trigger="onPick"
          valueProp="hue"
        >
          <Picker />
        </FormField>
      </Wrap>,
    );
    expect(screen.getByRole('button').textContent).toBe('red');
    fireEvent.click(screen.getByRole('button'));
    expect(form.getValue('color')).toBe('blue');
  });

  it('render prop receives field state and writes through onChange', () => {
    const { Wrap, form } = setup({ n: 1 });
    render(
      <Wrap>
        <FormField
          label="N"
          name="n"
          render={(field) => (
            <button type="button" onClick={() => field.onChange(field.value + 1)}>
              {String(field.value)}
            </button>
          )}
        />
      </Wrap>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(form.getValue('n')).toBe(2);
    expect(screen.getByRole('button').textContent).toBe('2');
  });

  it('bare renders the control without label or layout shell', () => {
    const { Wrap } = setup({ a: '' });
    render(
      <Wrap>
        <FormField bare label="Hidden label" name="a">
          <input aria-label="raw" />
        </FormField>
      </Wrap>,
    );
    expect(screen.queryByText('Hidden label')).toBeNull();
    expect(screen.getByLabelText('raw')).toBeTruthy();
  });

  it('warns in development when children is not a single element and no render is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { Wrap } = setup({ a: '' });
    render(
      <Wrap>
        <FormField label="A" name="a">
          text
        </FormField>
      </Wrap>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('Form.Field validation', () => {
  it('required shows the default message after blur and links it with aria', async () => {
    const { Wrap } = setup({ name: '' });
    render(
      <Wrap>
        <FormField required label="Name" name="name">
          <input />
        </FormField>
      </Wrap>,
    );
    const input = screen.getByLabelText(/Name/);
    fireEvent.blur(input);
    await act(() => wait());
    const error = screen.getByText('This field is required');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('required accepts a custom message', async () => {
    const { Wrap } = setup({ name: '' });
    render(
      <Wrap>
        <FormField label="Name" name="name" required="Name please">
          <input />
        </FormField>
      </Wrap>,
    );
    fireEvent.blur(screen.getByLabelText(/Name/));
    await act(() => wait());
    expect(screen.getByText('Name please')).toBeTruthy();
  });

  it('validates with a field-level schema and clears after a fix', async () => {
    const emailSchema = z.string().email('bad email');
    const { Wrap } = setup({ email: 'x' });
    render(
      <Wrap>
        <FormField label="Email" name="email" validate={emailSchema}>
          <input />
        </FormField>
      </Wrap>,
    );
    const input = screen.getByLabelText('Email');
    fireEvent.blur(input);
    await act(() => wait());
    expect(screen.getByText('bad email')).toBeTruthy();
    fireEvent.change(input, { target: { value: 'a@b.co' } });
    await act(() => wait());
    expect(screen.queryByText('bad email')).toBeNull();
  });

  it('an inline validate that changes identity every render registers once and uses the latest', async () => {
    const { Wrap, form } = setup({ a: '' });
    const register = vi.spyOn(getInternals(form).engine, 'registerField');
    let bump!: () => void;
    const Host = () => {
      const [n, setN] = useState(0);
      bump = () => setN((v) => v + 1);
      return (
        <Wrap>
          <FormField label="A" name="a" validate={(value) => (value ? undefined : `empty ${n}`)}>
            <input />
          </FormField>
        </Wrap>
      );
    };
    render(<Host />);
    act(() => bump());
    act(() => bump());
    expect(register).toHaveBeenCalledTimes(1);
    fireEvent.blur(screen.getByLabelText('A'));
    await act(() => wait());
    expect(screen.getByText('empty 2')).toBeTruthy();
  });

  it('deps re-validates when a dependency changes', async () => {
    const { Wrap, form } = setup({ confirm: 'abc', password: 'abc' });
    render(
      <Wrap>
        <FormField label="Password" name="password">
          <input />
        </FormField>
        <FormField
          deps={['password']}
          label="Confirm"
          name="confirm"
          validate={(value, values) => (value === values.password ? undefined : 'mismatch')}
        >
          <input />
        </FormField>
      </Wrap>,
    );
    fireEvent.blur(screen.getByLabelText('Confirm'));
    await act(() => wait());
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abcd' } });
    await act(() => wait());
    expect(form.getValue('password')).toBe('abcd');
    expect(screen.getByText('mismatch')).toBeTruthy();
  });
});
