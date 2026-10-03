import { act, render, renderHook, screen } from '@testing-library/react';
import { z } from 'zod';

import { useForm } from './useForm';
import { useWatch } from './useWatch';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe('useForm', () => {
  it('returns the same instance across re-renders', () => {
    const { result, rerender } = renderHook(() => useForm({ initialValues: { a: 1 } }));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('reads and writes values by dot path', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { agent: { model: 'a' }, list: [{ key: 'x' }] } }),
    );
    act(() => {
      result.current.setValue('agent.model', 'b');
      result.current.setValue('list.0.key', 'y');
    });
    expect(result.current.getValue('agent.model')).toBe('b');
    expect(result.current.getValues()).toEqual({ agent: { model: 'b' }, list: [{ key: 'y' }] });
  });

  it('maps schema issues to field paths on validate()', async () => {
    const schema = z.object({
      email: z.string().email('bad email'),
      nested: z.object({ n: z.number().min(2, 'too small') }),
    });
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: 'nope', nested: { n: 1 } }, schema }),
    );
    let outcome: Awaited<ReturnType<typeof result.current.validate>> | undefined;
    await act(async () => {
      outcome = await result.current.validate();
    });
    expect(outcome).toEqual({
      errors: { 'email': 'bad email', 'nested.n': 'too small' },
      valid: false,
    });
  });

  it('setSchema replaces the schema used by validate()', async () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { a: '' }, schema: z.object({ a: z.string().min(1, 'empty') }) }),
    );
    act(() => result.current.setSchema(z.object({ a: z.string() })));
    let valid = false;
    await act(async () => {
      valid = (await result.current.validate()).valid;
    });
    expect(valid).toBe(true);
  });

  it('onValuesChange fires for user changes only, with the changed slice and all values', () => {
    const onValuesChange = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { a: '', b: { c: '' } }, onValuesChange }),
    );
    act(() => result.current.setValue('a', 'from code'));
    expect(onValuesChange).not.toHaveBeenCalled();
    act(() => result.current.setValue('b.c', 'typed', { asUser: true }));
    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenCalledWith(
      { b: { c: 'typed' } },
      { a: 'from code', b: { c: 'typed' } },
    );
  });

  it('valuesChangeDebounce merges changes inside the window into one call', async () => {
    const onValuesChange = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { a: '', b: '' }, onValuesChange, valuesChangeDebounce: 30 }),
    );
    act(() => {
      result.current.setValue('a', '1', { asUser: true });
      result.current.setValue('b', '2', { asUser: true });
    });
    expect(onValuesChange).not.toHaveBeenCalled();
    await act(() => wait(60));
    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenCalledWith({ a: '1', b: '2' }, { a: '1', b: '2' });
  });

  it('values sync updates only fields the user has not edited', () => {
    const { result, rerender } = renderHook(
      ({ values }) => useForm({ initialValues: values, values }),
      { initialProps: { values: { a: 'server-1', b: 'server-1' } } },
    );
    act(() => result.current.setValue('a', 'typed', { asUser: true }));
    rerender({ values: { a: 'server-2', b: 'server-2' } });
    expect(result.current.getValues()).toEqual({ a: 'typed', b: 'server-2' });
  });

  it('subscribe calls back only when the selected slice changes', () => {
    const { result } = renderHook(() => useForm({ initialValues: { a: 0, b: 0 } }));
    const cb = vi.fn();
    const off = result.current.subscribe((v) => v.a, cb);
    act(() => result.current.setValue('b', 1));
    expect(cb).not.toHaveBeenCalled();
    act(() => result.current.setValue('a', 1));
    expect(cb).toHaveBeenCalledWith(1);
    off();
  });

  it('setErrors surfaces server errors through validate()', async () => {
    const { result } = renderHook(() => useForm({ initialValues: { email: 'a@b.c' } }));
    act(() => result.current.setErrors({ email: 'taken' }));
    let errors: Record<string, string> = {};
    await act(async () => {
      errors = (await result.current.validate(['email'])).errors;
    });
    expect(errors).toEqual({ email: 'taken' });
  });
});

describe('useWatch', () => {
  it('re-renders only when the watched path changes', () => {
    let renders = 0;
    let form!: ReturnType<typeof useForm<{ a: string; b: string }>>;
    const Watcher = () => {
      renders += 1;
      const a = useWatch(form, 'a');
      return <span data-testid="a">{a}</span>;
    };
    const Host = () => {
      form = useForm({ initialValues: { a: 'x', b: 'y' } });
      return <Watcher />;
    };
    render(<Host />);
    const base = renders;
    act(() => form.setValue('b', 'changed'));
    expect(renders).toBe(base);
    act(() => form.setValue('a', 'next'));
    expect(renders).toBe(base + 1);
    expect(screen.getByTestId('a').textContent).toBe('next');
  });

  it('accepts a selector', () => {
    let form!: ReturnType<typeof useForm<{ a: number; b: number }>>;
    const Sum = () => {
      const sum = useWatch(form, (v) => v.a + v.b);
      return <span data-testid="sum">{sum}</span>;
    };
    const Host = () => {
      form = useForm({ initialValues: { a: 1, b: 2 } });
      return <Sum />;
    };
    render(<Host />);
    act(() => form.setValue('a', 5));
    expect(screen.getByTestId('sum').textContent).toBe('7');
  });
});
